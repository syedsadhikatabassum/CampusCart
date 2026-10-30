import { Link } from "react-router-dom";
import { useStore } from "../context/store";
import { formatPrice } from "../utils";
import ProductImage from "./ProductImage";

export default function CartPreview() {
  const { cartItems, cartCount, cartTotal, loading } = useStore();
  const visible = cartItems.filter((item) => item.product).slice(0, 3);
  const extra = cartItems.filter((item) => item.product).length - visible.length;

  return (
    <section className="panel" aria-label="Cart preview">
      <div className="panel-head">
        <h3>Your Cart Preview</h3>
        <span>{cartCount} {cartCount === 1 ? "item" : "items"}</span>
      </div>
      {loading ? <p className="muted">Loading your cart…</p> : null}
      {!loading && visible.length === 0 ? (
        <p className="wish-copy">Your cart is waiting for the first pen or notebook.</p>
      ) : null}
      {visible.length > 0 ? (
        <div className="mini-list">
          {visible.map((item) => (
            <div className="mini-row" key={item.id}>
              <ProductImage product={item.product} className="thumb sm" />
              <div>
                <Link to={`/product/${item.product.id}`}>{item.product.name}</Link>
                <div className="muted">× {item.qty}</div>
              </div>
              <strong>{formatPrice(item.product.price * item.qty)}</strong>
            </div>
          ))}
        </div>
      ) : null}
      {extra > 0 ? <p className="muted">{extra} more in the cart</p> : null}
      <div className="total-row">
        <span>Total</span>
        <strong>{formatPrice(cartTotal)}</strong>
      </div>
      <Link className="btn btn-block" to="/cart">View Cart →</Link>
    </section>
  );
}
