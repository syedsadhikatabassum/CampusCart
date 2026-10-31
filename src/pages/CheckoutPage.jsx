import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import EmptyState from "../components/EmptyState";
import LoginPrompt from "../components/LoginPrompt";
import { IconCheck } from "../components/Icons";
import { formatPrice, shippingFee } from "../utils";

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  college: "",
  address: "",
  city: "",
  pincode: "",
  payment: "cod",
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, profile, setProfile, user, saveOrder } = useStore();
  const [arrivedLoggedOut] = useState(() => !user);
  const [form, setForm] = useState({
    ...EMPTY,
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    college: profile.college,
  });
  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState(null);
  usePageTitle("Checkout");

  useEffect(() => {
    if (!user) return;
    setForm((current) => ({
      ...current,
      name: profile.name,
      email: profile.email || user.email,
      phone: profile.phone,
      college: profile.college,
    }));
  }, [user, profile]);

  const fee = shippingFee(cartTotal);
  const payable = cartTotal + fee;

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  if (!user && !arrivedLoggedOut) return <Navigate to="/" replace />;
  if (!user) {
    return (
      <LoginPrompt
        title="Log in now"
        text="Sign in or register to check out."
        reason="checkout"
        next="/checkout"
      />
    );
  }

  if (order) {
    return (
      <div className="page">
        <div className="panel success-card empty">
          <div className="success-mark"><IconCheck /></div>
          <h1>Order {order.id} is placed</h1>
          <p>
            Thanks, {order.name}. This order is saved on your profile in this browser. No payment was taken.
          </p>
          <div className="order-list">
            {order.items.map((item) => (
              <div key={item.id}>
                <span>{item.name} × {item.qty}</span>
                <strong>{formatPrice(item.line)}</strong>
              </div>
            ))}
            <div className="confirm-total"><span>Total</span><strong>{formatPrice(order.total)}</strong></div>
          </div>
          <Link className="btn" to="/shop">Continue shopping</Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <EmptyState
          title="Add something before checkout"
          text="The cart is empty, so there is nothing to place."
          action={<Link className="btn" to="/shop">Go to the shop</Link>}
        />
      </div>
    );
  }

  const placeOrder = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter the student name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = "Enter a valid email.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ""))) next.phone = "Enter a 10-digit mobile number.";
    if (form.address.trim().length < 5) next.address = "Enter the delivery address.";
    if (form.city.trim().length < 2) next.city = "Enter the city.";
    if (!/^\d{6}$/.test(form.pincode.trim())) next.pincode = "Enter a 6-digit PIN code.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const items = cartItems
      .filter((item) => item.product)
      .map((item) => ({
        id: item.id,
        name: item.product.name,
        qty: item.qty,
        line: item.product.price * item.qty,
      }));

    const placed = {
      id: `CC-${Date.now().toString().slice(-8)}`,
      name: form.name.trim(),
      items,
      total: payable,
      placedAt: new Date().toISOString(),
    };
    setProfile({
      name: form.name.trim(),
      email: user.email,
      phone: form.phone.replace(/\s/g, ""),
      college: form.college.trim(),
    });
    saveOrder(placed);
    setOrder(placed);
    clearCart();
  };

  return (
    <div className="page">
      <header className="page-intro">
        <h1>Checkout</h1>
        <p>Tell us where the parcel should go. Payment is a demo choice and is not processed.</p>
      </header>
      <form className="cart-layout" onSubmit={placeOrder} noValidate>
        <div className="panel form-grid">
          <div className="form-row">
            <label className="field">
              Full name
              <input value={form.name} onChange={setField("name")} autoComplete="name" />
              {errors.name ? <span className="err">{errors.name}</span> : null}
            </label>
            <label className="field">
              Email
              <input value={form.email} onChange={setField("email")} autoComplete="email" type="email" readOnly />
              {errors.email ? <span className="err">{errors.email}</span> : null}
            </label>
          </div>
          <div className="form-row">
            <label className="field">
              Mobile
              <input value={form.phone} onChange={setField("phone")} autoComplete="tel" inputMode="numeric" />
              {errors.phone ? <span className="err">{errors.phone}</span> : null}
            </label>
            <label className="field">
              College
              <input value={form.college} onChange={setField("college")} />
            </label>
          </div>
          <label className="field">
            Address
            <textarea value={form.address} onChange={setField("address")} autoComplete="street-address" />
            {errors.address ? <span className="err">{errors.address}</span> : null}
          </label>
          <div className="form-row">
            <label className="field">
              City
              <input value={form.city} onChange={setField("city")} autoComplete="address-level2" />
              {errors.city ? <span className="err">{errors.city}</span> : null}
            </label>
            <label className="field">
              PIN code
              <input value={form.pincode} onChange={setField("pincode")} inputMode="numeric" autoComplete="postal-code" />
              {errors.pincode ? <span className="err">{errors.pincode}</span> : null}
            </label>
          </div>
          <fieldset className="form-grid" style={{ border: 0, padding: 0 }}>
            <legend className="field">Payment</legend>
            <div className="pay-grid">
              <label className={`pay${form.payment === "cod" ? " on" : ""}`}>
                <input type="radio" name="payment" value="cod" checked={form.payment === "cod"} onChange={setField("payment")} />
                <strong>Cash on delivery</strong>
                <small>Pay when the parcel arrives</small>
              </label>
              <label className={`pay${form.payment === "upi" ? " on" : ""}`}>
                <input type="radio" name="payment" value="upi" checked={form.payment === "upi"} onChange={setField("payment")} />
                <strong>UPI</strong>
                <small>Demo only, no charge</small>
              </label>
            </div>
          </fieldset>
        </div>
        <aside className="panel summary">
          <h2>To pay</h2>
          {cartItems.filter((item) => item.product).map((item) => (
            <div className="summary-row" key={item.id}>
              <span>{item.product.name} × {item.qty}</span>
              <strong>{formatPrice(item.product.price * item.qty)}</strong>
            </div>
          ))}
          <div className="summary-row"><span>Shipping</span><strong>{fee === 0 ? "Free" : formatPrice(fee)}</strong></div>
          <div className="summary-row grand"><span>Total</span><strong>{formatPrice(payable)}</strong></div>
          <button className="btn" type="submit">Place order</button>
          <Link className="btn btn-ghost" to="/cart">Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}
