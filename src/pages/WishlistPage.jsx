import { Link } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import EmptyState from "../components/EmptyState";
import ProductCard from "../components/ProductCard";

export default function WishlistPage() {
  const { wishItems, loading } = useStore();
  usePageTitle("Wishlist");

  return (
    <div className="page">
      <header className="page-intro">
        <h1>Wishlist</h1>
        <p>Saved with this login on this browser.</p>
      </header>
      {loading ? <p className="muted">Loading saved items…</p> : null}
      {!loading && wishItems.length === 0 ? (
        <EmptyState
          title="No favourites yet"
          text="Tap the heart on a product to keep it here."
          action={<Link className="btn" to="/shop">Find stationery</Link>}
        />
      ) : null}
      {wishItems.length > 0 ? (
        <div className="catalog-grid">
          {wishItems.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : null}
    </div>
  );
}
