import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import { formatPrice } from "../utils";

function placedLabel(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

export default function AccountPage() {
  const { profile, setProfile, user, logout, orders } = useStore();
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});
  usePageTitle("Your profile");

  if (!user) {
    if (leaving) return null;
    return <Navigate to="/login?next=/account" replace />;
  }

  const setField = (key) => (event) => {
    setSaved(false);
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your name.";
    if (form.phone.trim() && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      next.phone = "Enter a 10-digit mobile number.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setProfile({
      name: form.name.trim(),
      email: user.email,
      phone: form.phone.replace(/\s/g, ""),
      college: form.college.trim(),
    });
    setSaved(true);
  };

  return (
    <div className="page account-layout">
      <header className="page-intro">
        <h1>{user.name ? `Hello, ${user.name.split(" ")[0]}` : "Your profile"}</h1>
        <p>This profile, cart and wishlist are stored for {user.email} on this browser.</p>
      </header>
      <div className="split">
        <form className="panel form-grid" onSubmit={submit} noValidate>
          <label className="field">
            Name
            <input value={form.name} onChange={setField("name")} autoComplete="name" />
            {errors.name ? <span className="err">{errors.name}</span> : null}
          </label>
          <label className="field">
            Email
            <input value={user.email} type="email" readOnly />
          </label>
          <label className="field">
            Mobile
            <input value={form.phone} onChange={setField("phone")} autoComplete="tel" inputMode="numeric" />
            {errors.phone ? <span className="err">{errors.phone}</span> : null}
          </label>
          <label className="field">
            College
            <input value={form.college} onChange={setField("college")} />
          </label>
          <div className="buy-row">
            <button className="btn" type="submit">Save profile</button>
            <button
              className="btn btn-ghost"
              type="button"
              onClick={() => {
                setLeaving(true);
                logout();
                navigate("/login", { replace: true });
              }}
            >
              Sign out
            </button>
          </div>
          {saved ? <p className="save">Profile saved for this login.</p> : null}
        </form>
        <section className="panel">
          <h2>Orders</h2>
          {orders.length === 0 ? (
            <p className="lead">No orders yet. Your cart is kept for this login until you check out.</p>
          ) : (
            <div className="order-history">
              {orders.map((order) => (
                <article key={order.id}>
                  <div className="summary-row">
                    <strong>{order.id}</strong>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <p className="muted">{placedLabel(order.placedAt)}</p>
                  <p>{order.items.map((item) => `${item.name} × ${item.qty}`).join(", ")}</p>
                </article>
              ))}
            </div>
          )}
          <Link className="text-link" to="/cart">Open cart</Link>
        </section>
      </div>
    </div>
  );
}
