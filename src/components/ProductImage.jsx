import { useState } from "react";
import { categoryBySlug } from "../data/categories";
import { CategoryGlyph } from "./Icons";

export default function ProductImage({ product, className = "" }) {
  const [failed, setFailed] = useState(!product?.image);
  const tint = categoryBySlug(product?.category)?.tint || "writing";

  if (!product) return null;

  if (failed) {
    return (
      <div className={`photo-fallback ${tint} ${className}`.trim()}>
        <CategoryGlyph slug={product.category} />
        <span>{product.name}</span>
      </div>
    );
  }

  return (
    <img
      className={className}
      src={product.image}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
