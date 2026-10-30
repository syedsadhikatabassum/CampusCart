import {
  defaultExpenses,
  readJSON,
  sanitizeBudget,
  sanitizeCart,
  sanitizeExpenses,
  sanitizeOrders,
  sanitizeProfile,
  sanitizeWishlist,
  uid,
  writeJSON,
} from "./utils";

const USERS_KEY = "cc-users";
const SESSION_KEY = "cc-session";
const GUEST_KEY = "cc-guest";

export function emptyBag() {
  return {
    cart: [],
    wishlist: [],
    budget: 2000,
    expenses: defaultExpenses(),
    profile: { name: "", email: "", phone: "", college: "" },
    orders: [],
  };
}

export function normalizeBag(raw) {
  const source = raw && typeof raw === "object" ? raw : {};
  return {
    cart: sanitizeCart(source.cart),
    wishlist: sanitizeWishlist(source.wishlist),
    budget: sanitizeBudget(source.budget),
    expenses: sanitizeExpenses(source.expenses),
    profile: sanitizeProfile(source.profile),
    orders: sanitizeOrders(source.orders),
  };
}

function readGuest() {
  const stored = readJSON(GUEST_KEY, null);
  if (stored && typeof stored === "object") return normalizeBag(stored);
  return normalizeBag({
    cart: readJSON("cc-cart", []),
    wishlist: readJSON("cc-wish", []),
    budget: readJSON("cc-budget", 2000),
    expenses: readJSON("cc-expenses", null),
    profile: readJSON("cc-profile", null),
    orders: [],
  });
}

export function writeGuest(bag) {
  writeJSON(GUEST_KEY, normalizeBag(bag));
}

function readUsers() {
  const data = readJSON(USERS_KEY, []);
  if (!Array.isArray(data)) return [];
  return data.filter((user) => user && user.id && user.email && user.password);
}

function writeUsers(users) {
  writeJSON(USERS_KEY, users);
}

export function readSessionId() {
  const id = readJSON(SESSION_KEY, null);
  return typeof id === "string" && id ? id : null;
}

function writeSessionId(id) {
  if (id) writeJSON(SESSION_KEY, id);
  else {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Ignore storage failures.
    }
  }
}

function toPublic(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    college: user.college || "",
  };
}

function bagFromUser(user) {
  return normalizeBag({
    cart: user.cart,
    wishlist: user.wishlist,
    budget: user.budget,
    expenses: user.expenses,
    orders: user.orders,
    profile: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      college: user.college,
    },
  });
}

export function readBoot() {
  const sessionId = readSessionId();
  const users = readUsers();
  const user = users.find((item) => item.id === sessionId);
  if (sessionId && !user) {
    writeSessionId(null);
    return { user: null, ownerId: null, bag: readGuest() };
  }
  if (user) {
    return { user: toPublic(user), ownerId: user.id, bag: bagFromUser(user) };
  }
  return { user: null, ownerId: null, bag: readGuest() };
}

export function saveUserBag(id, bag) {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index < 0) return;
  const current = users[index];
  const profile = sanitizeProfile(bag.profile);
  users[index] = {
    ...current,
    name: profile.name || current.name,
    phone: profile.phone,
    college: profile.college,
    cart: sanitizeCart(bag.cart),
    wishlist: sanitizeWishlist(bag.wishlist),
    budget: sanitizeBudget(bag.budget),
    expenses: sanitizeExpenses(bag.expenses),
    orders: sanitizeOrders(bag.orders),
  };
  writeUsers(users);
}

export function mergeCart(base, extra) {
  const map = new Map(sanitizeCart(base).map((item) => [item.id, { ...item }]));
  sanitizeCart(extra).forEach((item) => {
    const found = map.get(item.id);
    if (found) found.qty = Math.min(10, found.qty + item.qty);
    else map.set(item.id, { ...item });
  });
  return [...map.values()];
}

export function findUserByEmail(email) {
  const key = email.trim().toLowerCase();
  return readUsers().find((user) => user.email.toLowerCase() === key) || null;
}

export function createUser({ name, email, password, college, cart, wishlist, budget, expenses }) {
  const users = readUsers();
  const user = {
    id: uid(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password,
    phone: "",
    college: college.trim(),
    cart: sanitizeCart(cart),
    wishlist: sanitizeWishlist(wishlist),
    budget: sanitizeBudget(budget),
    expenses: sanitizeExpenses(expenses),
    orders: [],
  };
  writeUsers([...users, user]);
  return user;
}

export function replaceUser(next) {
  const users = readUsers();
  writeUsers(users.map((user) => (user.id === next.id ? next : user)));
}

export function beginSession(user) {
  writeSessionId(user.id);
  return { publicUser: toPublic(user), bag: bagFromUser(user) };
}

export function endSession() {
  writeSessionId(null);
  return readGuest();
}
