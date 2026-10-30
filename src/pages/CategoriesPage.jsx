import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import { CategoryGlyph } from "../components/Icons";

export default function CategoriesPage() {
  const { products } = useStore();
  usePageTitle("Categories");

  return (
    <div className="page">
      <header className="page-intro">
        <h1>Categories</h1>
        <p>Seven shelves, from writing tools to the bag you carry them in.</p>
      </header>
      <div className="category-grid">
        {CATEGORIES.map((category) => {
          const count = products.filter((product) => product.category === category.slug).length;
          return (
            <Link key={category.slug} to={`/category/${category.slug}`} className={`category-tile ${category.tint}`}>
              <CategoryGlyph slug={category.slug} />
              <strong>{category.name}</strong>
              <p>{category.blurb}</p>
              <span className="count-pill">{count} {count === 1 ? "item" : "items"}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
