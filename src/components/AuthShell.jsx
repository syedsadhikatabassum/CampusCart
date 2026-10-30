import { Link, Navigate, useSearchParams } from "react-router-dom";
import { useStore } from "../context/store";
import { safeNext } from "../utils";
import Logo from "./Logo";

export default function AuthShell({ mode, title, lead, children }) {
  const { user } = useStore();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const loginTo = next === "/" ? "/login" : `/login?next=${encodeURIComponent(next)}`;
  const registerTo = next === "/" ? "/register" : `/register?next=${encodeURIComponent(next)}`;

  if (user) return <Navigate to={next} replace />;

  return (
    <div className="auth-wrap">
      <section className="auth-card">
        <Logo to={mode === "register" ? "/register" : "/login"} />
        <div className="auth-switch" role="tablist" aria-label="Account">
          <Link to={loginTo} className={mode === "login" ? "on" : ""}>Log in</Link>
          <Link to={registerTo} className={mode === "register" ? "on" : ""}>Register</Link>
        </div>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
        {children}
      </section>
    </div>
  );
}
