import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";
import { CategoryGlyph, IconArrow } from "./Icons";

export default function CategoryStrip() {
  return (
    <section className="cat-row" aria-label="Shop by category">
      {CATEGORIES.map((category) => (
        <Link key={category.slug} to={`/category/${category.slug}`} className={`cat-card ${category.tint}`}>
          <CategoryGlyph slug={category.slug} />
          <span>{category.name}</span>
        </Link>
      ))}
      <Link to="/categories" className="cat-card view-all">
        <span className="view-all-icon"><IconArrow /></span>
        <span>View All</span>
      </Link>
    </section>
  );
}
