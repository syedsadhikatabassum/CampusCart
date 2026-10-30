import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CATEGORIES, categoryBySlug } from "../data/categories";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import EmptyState from "../components/EmptyState";
import ErrorNote from "../components/ErrorNote";
import ProductCard from "../components/ProductCard";
import ProductSkeleton from "../components/ProductSkeleton";

const PRICES = [
  { id: "all", label: "All prices" },
  { id: "under-200", label: "Under ₹200" },
  { id: "200-500", label: "₹200 – ₹500" },
  { id: "over-500", label: "Over ₹500" },
];

export default function Shop() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { products, loading, search, setSearch } = useStore();
  const [sort, setSort] = useState("featured");
  const [price, setPrice] = useState("all");
  const category = slug ? categoryBySlug(slug) : null;

  usePageTitle(category ? category.name : "Shop");

  if (slug && !category) {
    return (
      <div className="page">
        <EmptyState
          title="That category is not on the shelf"
          text="Browse the full stationery shop instead."
          action={<Link className="btn" to="/shop">Back to shop</Link>}
        />
      </div>
    );
  }

  const query = search.trim().toLowerCase();
  let visible = products.filter((product) => (slug ? product.category === slug : true));

  if (query) {
    visible = visible.filter((product) => {
      const categoryName = categoryBySlug(product.category)?.name.toLowerCase() || "";
      const tags = (product.tags || []).join(" ").toLowerCase();
      return (
        product.name.toLowerCase().includes(query)
        || product.description.toLowerCase().includes(query)
        || categoryName.includes(query)
        || tags.includes(query)
      );
    });
  }

  if (price === "under-200") visible = visible.filter((product) => product.price < 200);
  if (price === "200-500") visible = visible.filter((product) => product.price >= 200 && product.price <= 500);
  if (price === "over-500") visible = visible.filter((product) => product.price > 500);

  visible = [...visible].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "rating") return b.rating - a.rating;
    return Number(b.featured) - Number(a.featured) || b.rating - a.rating;
  });

  const clearFilters = () => {
    setSearch("");
    setPrice("all");
    setSort("featured");
    navigate("/shop");
  };

  const title = category ? category.name : "Shop stationery";
  const subtitle = query
    ? `Matches for “${search.trim()}”${category ? ` in ${category.name}` : ""}.`
    : category?.blurb || "Pens, books, lab records and the rest of a student list.";

  return (
    <div className="page">
      <header className="page-intro">
        <p className="crumbs">
          <Link to="/">Home</Link>
          <span aria-hidden="true"> / </span>
          {category ? <Link to="/shop">Shop</Link> : <span>Shop</span>}
          {category ? (
            <>
              <span aria-hidden="true"> / </span>
              <span>{category.name}</span>
            </>
          ) : null}
        </p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </header>

      <div className="toolbar">
        <div className="pills" aria-label="Categories">
          <Link to="/shop" className={`pill${!slug ? " on" : ""}`}>All</Link>
          {CATEGORIES.map((item) => (
            <Link
              key={item.slug}
              to={`/category/${item.slug}`}
              className={`pill${slug === item.slug ? " on" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="toolbar-right">
          <p className="result-count">{loading ? "Loading…" : `${visible.length} products`}</p>
          <label className="sort">
            <span className="sr-only">Sort products</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top rated</option>
            </select>
          </label>
        </div>
      </div>

      <div className="pills price-pills" aria-label="Price">
        {PRICES.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`pill${price === item.id ? " on" : ""}`}
            onClick={() => setPrice(item.id)}
          >
            {item.label}
          </button>
        ))}
        {(slug || query || price !== "all") ? (
          <button type="button" className="pill" onClick={clearFilters}>Clear</button>
        ) : null}
      </div>

      <ErrorNote />

      {loading ? (
        <div className="catalog-grid">
          {Array.from({ length: 8 }, (_, index) => <ProductSkeleton key={index} />)}
        </div>
      ) : null}

      {!loading && visible.length === 0 ? (
        <EmptyState
          title="Nothing matches this search"
          text="Try another word, or clear the filters to see the full catalogue."
          action={<button type="button" className="btn" onClick={clearFilters}>Clear filters</button>}
        />
      ) : null}

      {!loading && visible.length > 0 ? (
        <div className="catalog-grid">
          {visible.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      ) : null}
    </div>
  );
}
