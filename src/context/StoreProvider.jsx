import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { StoreContext } from "./store";
import {
  beginSession,
  createUser,
  emptyBag,
  endSession,
  findUserByEmail,
  mergeCart,
  readBoot,
  replaceUser,
  saveUserBag,
  writeGuest,
} from "../authStorage";
import { sanitizeWishlist, uid } from "../utils";

function cleanProducts(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item) => item && item.id && item.name && item.category && Number.isFinite(Number(item.price)))
    .map((item) => ({
      ...item,
      id: String(item.id),
      price: Number(item.price),
      mrp: Number(item.mrp) || Number(item.price),
      rating: Number(item.rating) || 0,
      reviews: Number(item.reviews) || 0,
      stock: Number(item.stock) || 0,
      tags: Array.isArray(item.tags) ? item.tags : [],
      featured: Boolean(item.featured),
    }));
}

export default function StoreProvider({ children }) {
  const [boot] = useState(() => readBoot());
  const ownerRef = useRef(boot.ownerId);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [user, setUser] = useState(boot.user);
  const userRef = useRef(boot.user);
  userRef.current = user;
  const [authPrompt, setAuthPrompt] = useState(null);
  const [cart, setCart] = useState(boot.bag.cart);
  const [wishlist, setWishlist] = useState(boot.bag.wishlist);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("cc-theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const [search, setSearch] = useState("");
  const [budget, setBudgetState] = useState(boot.bag.budget);
  const [expenses, setExpenses] = useState(boot.bag.expenses);
  const [profile, setProfileState] = useState(boot.bag.profile);
  const [orders, setOrders] = useState(boot.bag.orders);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let active = true;
    axios
      .get("/products.json", { timeout: 8000 })
      .then((response) => {
        if (!active) return;
        setProducts(cleanProducts(response.data));
        setError("");
      })
      .catch(() => {
        if (!active) return;
        setError("We could not load the stationery catalogue. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("cc-theme", theme);
    } catch {
      // Ignore storage failures.
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b1220" : "#f4f7fb");
  }, [theme]);

  useEffect(() => {
    const bag = { cart, wishlist, budget, expenses, profile, orders };
    if (ownerRef.current) saveUserBag(ownerRef.current, bag);
    else writeGuest(bag);
  }, [cart, wishlist, budget, expenses, profile, orders]);

  const pushToast = (message) => {
    const id = uid();
    setToasts((list) => [...list, { id, message }].slice(-3));
    window.setTimeout(() => {
      setToasts((list) => list.filter((item) => item.id !== id));
    }, 2200);
  };

  const applyBag = (bag, nextUser) => {
    setUser(nextUser);
    setCart(bag.cart);
    setWishlist(bag.wishlist);
    setBudgetState(bag.budget);
    setExpenses(bag.expenses);
    setProfileState(bag.profile);
    setOrders(bag.orders);
  };

  const reload = () => {
    setLoading(true);
    setError("");
    setReloadKey((value) => value + 1);
  };

  const openAuth = useCallback((prompt = {}) => {
    setAuthPrompt({
      mode: prompt.mode === "register" ? "register" : "login",
      reason: prompt.reason || "login",
      next: prompt.next || "",
      pendingAdd: prompt.pendingAdd || null,
    });
  }, []);

  const closeAuth = useCallback(() => setAuthPrompt(null), []);

  const withPendingAdd = (currentCart) => {
    const pending = authPrompt?.pendingAdd;
    if (!pending) return currentCart;
    const amount = Math.min(10, Math.max(1, Number(pending.qty) || 1));
    const found = currentCart.find((item) => item.id === pending.id);
    if (!found) return [...currentCart, { id: pending.id, qty: amount }];
    return currentCart.map((item) => (
      item.id === pending.id ? { ...item, qty: Math.min(10, item.qty + amount) } : item
    ));
  };

  const toastPendingAdd = () => {
    const pending = authPrompt?.pendingAdd;
    if (!pending) return;
    const product = products.find((item) => item.id === pending.id);
    pushToast(product ? `${product.name} added to cart` : "Added to cart");
  };

  const login = (email, password) => {
    const found = findUserByEmail(email);
    if (!found || found.password !== password) {
      return { ok: false, message: "That email and password do not match." };
    }
    const guestItems = cart.length;
    const next = {
      ...found,
      cart: withPendingAdd(mergeCart(found.cart, cart)),
      wishlist: sanitizeWishlist([...(found.wishlist || []), ...wishlist]),
    };
    replaceUser(next);
    writeGuest(emptyBag());
    ownerRef.current = next.id;
    const session = beginSession(next);
    userRef.current = session.publicUser;
    applyBag(session.bag, session.publicUser);
    toastPendingAdd();
    return { ok: true, name: next.name, merged: guestItems > 0 };
  };

  const register = ({ name, email, password, college }) => {
    if (findUserByEmail(email)) {
      return { ok: false, message: "An account with this email already exists on this browser." };
    }
    const created = createUser({
      name,
      email,
      password,
      college,
      cart: withPendingAdd(cart),
      wishlist,
      budget,
      expenses,
    });
    writeGuest(emptyBag());
    ownerRef.current = created.id;
    const session = beginSession(created);
    userRef.current = session.publicUser;
    applyBag(session.bag, session.publicUser);
    toastPendingAdd();
    return { ok: true, name: created.name };
  };

  const logout = () => {
    ownerRef.current = null;
    userRef.current = null;
    const guest = endSession();
    applyBag(guest, null);
    pushToast("Signed out");
  };

  const addToCart = (id, qty = 1) => {
    if (!userRef.current) {
      openAuth({
        reason: "add",
        pendingAdd: { id, qty: Math.min(10, Math.max(1, qty)) },
      });
      return false;
    }
    const product = products.find((item) => item.id === id);
    const existing = cart.find((item) => item.id === id);
    if (existing && existing.qty >= 10) {
      pushToast("You can add up to 10 of each item");
      return false;
    }
    setCart((prev) => {
      const found = prev.find((item) => item.id === id);
      if (found) {
        return prev.map((item) =>
          item.id === id ? { ...item, qty: Math.min(10, item.qty + qty) } : item,
        );
      }
      return [...prev, { id, qty: Math.min(10, Math.max(1, qty)) }];
    });
    pushToast(product ? `${product.name} added to cart` : "Added to cart");
    return true;
  };

  const setQty = (id, qty) => {
    setCart((prev) => {
      if (qty < 1) return prev.filter((item) => item.id !== id);
      return prev.map((item) => (item.id === id ? { ...item, qty: Math.min(10, qty) } : item));
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    pushToast("Removed from cart");
  };

  const clearCart = () => setCart([]);

  const toggleWish = (id) => {
    const product = products.find((item) => item.id === id);
    const saved = wishlist.includes(id);
    setWishlist((prev) => (saved ? prev.filter((item) => item !== id) : [...prev, id]));
    pushToast(saved ? "Removed from wishlist" : `${product?.name || "Item"} saved to wishlist`);
  };

  const toggleTheme = () => setTheme((value) => (value === "dark" ? "light" : "dark"));

  const setBudget = (value) => {
    const next = Math.round(Number(value));
    if (!Number.isFinite(next) || next < 0) return;
    setBudgetState(Math.min(500000, next));
  };

  const addExpense = (label, amount) => {
    const name = label.trim();
    const value = Math.round(Number(amount));
    if (!name || !Number.isFinite(value) || value <= 0) return false;
    setExpenses((list) => [...list, { id: uid(), label: name, amount: value }]);
    return true;
  };

  const removeExpense = (id) => {
    setExpenses((list) => list.filter((item) => item.id !== id));
  };

  const setProfile = (next) => {
    const phone = String(next.phone || "").replace(/\s/g, "");
    const college = String(next.college || "").trim();
    const name = String(next.name || "").trim();
    setProfileState((current) => ({
      name,
      email: ownerRef.current ? current.email : String(next.email || "").trim(),
      phone,
      college,
    }));
    if (ownerRef.current) {
      setUser((current) => (current ? { ...current, name, phone, college } : current));
    }
  };

  const saveOrder = (order) => {
    setOrders((list) => [order, ...list]);
  };

  const cartItems = cart.map((item) => ({
    ...item,
    product: products.find((product) => product.id === item.id) || null,
  }));

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.qty;
  }, 0);

  const wishItems = wishlist
    .map((id) => products.find((product) => product.id === id))
    .filter(Boolean);

  const spent = expenses.reduce((sum, item) => sum + item.amount, 0);
  const remaining = budget - spent;

  const value = {
    products,
    loading,
    error,
    reload,
    user,
    authPrompt,
    openAuth,
    closeAuth,
    login,
    register,
    logout,
    orders,
    saveOrder,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    wishlist,
    wishItems,
    toggleWish,
    theme,
    toggleTheme,
    search,
    setSearch,
    budget,
    setBudget,
    expenses,
    addExpense,
    removeExpense,
    spent,
    remaining,
    profile,
    setProfile,
    toasts,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
