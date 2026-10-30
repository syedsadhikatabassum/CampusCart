export default function Stars({ value }) {
  const score = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span className="stars" aria-label={`${score.toFixed(1)} out of 5 stars`}>
      <span className="stars-base">★★★★★</span>
      <span className="stars-fill" style={{ width: `${(score / 5) * 100}%` }}>★★★★★</span>
    </span>
  );
}
