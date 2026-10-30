import { Link } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import BudgetPlanner from "../components/BudgetPlanner";
import CartPreview from "../components/CartPreview";
import CategoryStrip from "../components/CategoryStrip";
import ErrorNote from "../components/ErrorNote";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";
import TrustBar from "../components/TrustBar";
import WishlistPreview from "../components/WishlistPreview";

export default function Home() {
  const { products, loading } = useStore();
  usePageTitle("");
  const featured = products.filter((product) => product.featured).slice(0, 8);

  return (
    <div className="page stack">
      <Hero />
      <CategoryStrip />
      <section aria-labelledby="featured-title">
        <div className="section-head">
          <h2 id="featured-title">Featured Products</h2>
          <Link to="/shop">View All →</Link>
        </div>
        <ErrorNote />
        <div className="home-layout">
          {loading ? (
            <div className="featured-grid">
              {Array.from({ length: 8 }, (_, index) => <ProductSkeleton key={index} />)}
            </div>
          ) : (
            <div className="featured-grid">
              {featured.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
          <aside className="side-stack">
            <BudgetPlanner compact />
            <CartPreview />
            <WishlistPreview />
          </aside>
        </div>
      </section>
      <TrustBar />
    </div>
  );
}
