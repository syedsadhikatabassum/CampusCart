import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/store";
import { BADGES, formatPrice } from "../utils";
import { IconCart, IconHeart } from "./Icons";
import ProductImage from "./ProductImage";
import Stars from "./Stars";

export default function ProductCard({ product }) {
  const { addToCart, toggleWish, wishlist } = useStore();
  const [added, setAdded] = useState(false);
  const timer = useRef(null);
  const saved = wishlist.includes(product.id);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onAdd = () => {
    if (!addToCart(product.id, 1)) return;
    setAdded(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAdded(false), 1100);
  };

  return (
    <article className="product-card">
      <div className="product-media">
        <Link className="product-photo" to={`/product/${product.id}`} tabIndex={-1}>
          <ProductImage product={product} />
        </Link>
        {product.badge && BADGES[product.badge] ? (
          <span className={`flag ${product.badge}`}>{BADGES[product.badge]}</span>
        ) : null}
        <button
          type="button"
          className={`wish-btn${saved ? " on" : ""}`}
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          onClick={() => toggleWish(product.id)}
        >
          <IconHeart filled={saved} />
        </button>
      </div>
      <div className="product-body">
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="rating-row">
          <Stars value={product.rating} />
          <span>{product.rating.toFixed(1)} ({product.reviews})</span>
        </div>
        <div className="price-row">
          <strong>{formatPrice(product.price)}</strong>
          {product.mrp > product.price ? <s>{formatPrice(product.mrp)}</s> : null}
        </div>
        <button type="button" className={`btn btn-block${added ? " added" : ""}`} onClick={onAdd}>
          <IconCart />
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}
