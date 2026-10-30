import { Link } from "react-router-dom";
import { useStore } from "../context/store";
import { IconHeart } from "./Icons";
import ProductImage from "./ProductImage";

export default function WishlistPreview() {
  const { wishItems } = useStore();
  const preview = wishItems.slice(0, 2);

  return (
    <section className="panel panel-wish" aria-label="Wishlist preview">
      <div className="wish-head">
        <span className="wish-badge"><IconHeart filled /></span>
        <h3>Your Wishlist</h3>
      </div>
      <p className="wish-copy">
        {wishItems.length > 0
          ? `${wishItems.length} saved ${wishItems.length === 1 ? "item" : "items"} for later.`
          : "Save your favourite products for later."}
      </p>
      {preview.length > 0 ? (
        <div className="mini-list">
          {preview.map((product) => (
            <div className="mini-row two" key={product.id}>
              <ProductImage product={product} className="thumb sm" />
              <Link to={`/product/${product.id}`}>{product.name}</Link>
            </div>
          ))}
        </div>
      ) : null}
      <Link className="btn btn-ghost btn-block" to="/wishlist">View Wishlist →</Link>
    </section>
  );
}
