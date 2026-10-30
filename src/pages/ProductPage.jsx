import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { categoryBySlug } from "../data/categories";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import Crumbs from "../components/Crumbs";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";
import ProductImage from "../components/ProductImage";
import QtyControl from "../components/QtyControl";
import Stars from "../components/Stars";
import { IconCart, IconHeart } from "../components/Icons";
import { formatPrice, FREE_SHIPPING_AT } from "../utils";

export default function ProductPage() {
  const { id } = useParams();
  const { products, loading, addToCart, toggleWish, wishlist } = useStore();
  const [qty, setQty] = useState(1);
  const product = products.find((item) => item.id === id);
  const category = product ? categoryBySlug(product.category) : null;

  usePageTitle(product ? product.name : "Product");

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page">
        <EmptyState
          title="This product is not in the catalogue"
          text="It may have been removed from the stationery list."
          action={<Link className="btn" to="/shop">Browse the shop</Link>}
        />
      </div>
    );
  }

  const saved = wishlist.includes(product.id);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);

  return (
    <div className="page">
      <Crumbs
        items={[
          { label: "Shop", to: "/shop" },
          { label: category?.name || "Category", to: category ? `/category/${category.slug}` : "/shop" },
          { label: product.name },
        ]}
      />
      <article className="pdp">
        <div className="pdp-photo">
          <ProductImage product={product} />
        </div>
        <div>
          {category ? <Link className="kicker" to={`/category/${category.slug}`}>{category.name}</Link> : null}
          <h1>{product.name}</h1>
          <div className="rating-row">
            <Stars value={product.rating} />
            <span>{product.rating.toFixed(1)} · {product.reviews} reviews</span>
          </div>
          <div className="pdp-price">
            {formatPrice(product.price)}
            {product.mrp > product.price ? <s>{formatPrice(product.mrp)}</s> : null}
          </div>
          {product.mrp > product.price ? (
            <p className="save">You save {formatPrice(product.mrp - product.price)}</p>
          ) : null}
          <p className="lead">{product.description}</p>
          <ul className="specs">
            <li><span>Category</span><strong>{category?.name}</strong></li>
            <li><span>Availability</span><strong>In stock</strong></li>
            <li><span>Dispatch</span><strong>2–4 working days</strong></li>
            <li><span>Free shipping</span><strong>Orders over {formatPrice(FREE_SHIPPING_AT)}</strong></li>
          </ul>
          <div className="buy-row">
            <QtyControl value={qty} onChange={(next) => setQty(Math.min(10, Math.max(1, next)))} label="Quantity" />
            <button type="button" className="btn" onClick={() => addToCart(product.id, qty)}>
              <IconCart /> Add to Cart
            </button>
            <button
              type="button"
              className={`btn btn-ghost${saved ? " on" : ""}`}
              aria-pressed={saved}
              onClick={() => toggleWish(product.id)}
            >
              <IconHeart filled={saved} />
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </article>
      {related.length > 0 ? (
        <section className="related" aria-labelledby="related-title">
          <h2 id="related-title">More in {category?.name}</h2>
          <div className="catalog-grid">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
