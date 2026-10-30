import { Link } from "react-router-dom";
import { IconCart } from "./Icons";

export default function Logo({ to = "/" }) {
  return (
    <Link to={to} className="logo" aria-label={to === "/" ? "CampusCart home" : "CampusCart"}>
      <span className="logo-mark">
        <IconCart />
      </span>
      <span>
        <strong>CampusCart</strong>
        <small>Study Today · Build Tomorrow</small>
      </span>
    </Link>
  );
}
