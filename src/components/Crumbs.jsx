import { Link } from "react-router-dom";

export default function Crumbs({ items }) {
  return (
    <p className="crumbs">
      <Link to="/">Home</Link>
      {items.map((item) => (
        <span key={item.label}>
          <span aria-hidden="true"> / </span>
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </p>
  );
}
