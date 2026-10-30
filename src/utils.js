export const BADGES = {
  bestseller: "Bestseller",
  top: "Top Rated",
  popular: "Popular",
};

export const FREE_SHIPPING_AT = 999;
export const SHIPPING_FEE = 49;

export function formatPrice(value) {
  const amount = Number(value) || 0;
  const formatted = Math.abs(Math.round(amount)).toLocaleString("en-IN");
  return amount < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

export function shippingFee(subtotal) {
  if (subtotal <= 0 || subtotal >= FREE_SHIPPING_AT) return 0;
  return SHIPPING_FEE;
}

export function uid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode or a full disk should not break the shop.
  }
}

export function readTheme() {
  try {
    return localStorage.getItem("cc-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

const DEFAULT_EXPENSES = [
  { id: "e1", label: "Notebooks", amount: 450 },
  { id: "e2", label: "Lab records", amount: 380 },
  { id: "e3", label: "Pens & highlighters", amount: 420 },
];

export function readExpenses() {
  const data = readJSON("cc-expenses", null);
  if (!Array.isArray(data)) return DEFAULT_EXPENSES;
  return data
    .filter((item) => item && typeof item.label === "string" && Number.isFinite(Number(item.amount)))
    .map((item) => ({
      id: String(item.id || uid()),
      label: item.label,
      amount: Math.round(Number(item.amount)),
    }));
}

export function sanitizeCart(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter((item) => item && item.id && Number(item.qty) > 0)
    .map((item) => ({ id: String(item.id), qty: Math.min(10, Math.round(Number(item.qty))) }));
}

export function sanitizeWishlist(data) {
  if (!Array.isArray(data)) return [];
  return [...new Set(data.map((id) => String(id)).filter(Boolean))];
}

export function sanitizeProfile(data) {
  if (!data || typeof data !== "object") {
    return { name: "", email: "", phone: "", college: "" };
  }
  return {
    name: String(data.name || ""),
    email: String(data.email || ""),
    phone: String(data.phone || ""),
    college: String(data.college || ""),
  };
}

export function sanitizeBudget(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return 2000;
  return Math.min(500000, Math.round(amount));
}

export function defaultExpenses() {
  return DEFAULT_EXPENSES.map((item) => ({ ...item }));
}

export function sanitizeExpenses(data) {
  if (!Array.isArray(data)) return defaultExpenses();
  return data
    .filter((item) => item && typeof item.label === "string" && Number.isFinite(Number(item.amount)))
    .map((item) => ({
      id: String(item.id || uid()),
      label: item.label,
      amount: Math.round(Number(item.amount)),
    }));
}

export function sanitizeOrders(data) {
  if (!Array.isArray(data)) return [];
  return data
    .filter((order) => order && order.id && Array.isArray(order.items))
    .map((order) => ({
      id: String(order.id),
      name: String(order.name || ""),
      total: Number(order.total) || 0,
      placedAt: String(order.placedAt || ""),
      items: order.items
        .filter((item) => item && item.name)
        .map((item) => ({
          id: String(item.id || item.name),
          name: String(item.name),
          qty: Number(item.qty) || 1,
          line: Number(item.line) || 0,
        })),
    }));
}

export function readCart() {
  return sanitizeCart(readJSON("cc-cart", []));
}

export function readWishlist() {
  return sanitizeWishlist(readJSON("cc-wish", []));
}

export function readProfile() {
  return sanitizeProfile(readJSON("cc-profile", null));
}

export function readBudget() {
  return sanitizeBudget(readJSON("cc-budget", 2000));
}

export function safeNext(value) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}
