import { Link } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import EmptyState from "../components/EmptyState";

export default function NotFound() {
  usePageTitle("Page not found");
  return (
    <div className="page">
      <EmptyState
        title="This page is not on the shelf"
        text="The link may be old. The shop is still open."
        action={<Link className="btn" to="/">Back home</Link>}
      />
    </div>
  );
}
