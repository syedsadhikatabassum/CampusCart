import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import EmptyState from "../components/EmptyState";
import LoginPrompt from "../components/LoginPrompt";
import ProductImage from "../components/ProductImage";
import QtyControl from "../components/QtyControl";
import { FREE_SHIPPING_AT, formatPrice, shippingFee } from "../utils";

export default function CartPage() {
  const { cartItems, cartTotal, setQty, removeFromCart, user } = useStore();
  const [arrivedLoggedOut] = useState(() => !user);
  usePageTitle("Cart");
  const fee = shippingFee(cartTotal);
  const payable = cartTotal + fee;
  const away = Math.max(0, FREE_SHIPPING_AT - cartTotal);

  if (!user && !arrivedLoggedOut) return <Navigate to="/" replace />;
  if (!user) {
    return (
      <LoginPrompt
        title="Log in now"
        text="Sign in or register to open your cart."
        reason="cart"
        next="/cart"
      />
    );
  }

  return (
    <div className="page">
      <header className="page-intro">
        <h1>Your cart</h1>
        <p>This cart is saved for {user?.name || user?.email}. Nothing is charged.</p>
      </header>
      {cartItems.length === 0 ? (
        <EmptyState
          title="The cart is empty"
          text="Add a notebook, a pen set or a lab record to get started."
          action={<Link className="btn" to="/shop">Browse stationery</Link>}
        />
      ) : (
        <div className="cart-layout">
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li className="cart-item" key={item.id}>
                {item.product ? <ProductImage product={item.product} className="thumb" /> : <div className="thumb photo-fallback writing" />}
                <div className="cart-info">
                  {item.product ? (
                    <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                  ) : (
                    <span>This item is no longer listed</span>
                  )}
                  <p className="muted">{item.product ? `${formatPrice(item.product.price)} each` : ""}</p>
                  <QtyControl
                    value={item.qty}
                    label={`Quantity for ${item.product?.name || "item"}`}
                    onChange={(next) => setQty(item.id, next)}
                  />
                </div>
                <div className="cart-side">
                  <strong>{item.product ? formatPrice(item.product.price * item.qty) : ""}</strong>
                  <button type="button" className="text-btn" onClick={() => removeFromCart(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <aside className="panel summary">
            <h2>Order summary</h2>
            <div className="summary-row"><span>Subtotal</span><strong>{formatPrice(cartTotal)}</strong></div>
            <div className="summary-row"><span>Shipping</span><strong>{fee === 0 ? "Free" : formatPrice(fee)}</strong></div>
            <div className="summary-row grand"><span>Total</span><strong>{formatPrice(payable)}</strong></div>
            <p className="ship-hint">
              {fee === 0
                ? "This order qualifies for free shipping."
                : `Add ${formatPrice(away)} more for free shipping.`}
            </p>
            <Link className="btn btn-block" to="/checkout">Checkout</Link>
            <Link className="btn btn-ghost btn-block" to="/shop">Continue shopping</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
