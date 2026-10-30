export default function ProductSkeleton() {
  return (
    <article className="product-card skeleton-card" aria-hidden="true">
      <div className="sk sk-img" />
      <div className="product-body">
        <div className="sk sk-line" />
        <div className="sk sk-line short" />
        <div className="sk sk-line" />
      </div>
    </article>
  );
}
