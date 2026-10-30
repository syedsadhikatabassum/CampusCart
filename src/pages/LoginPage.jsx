import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import { safeNext } from "../utils";
import AuthShell from "../components/AuthShell";

export default function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  usePageTitle("Log in");

  const submit = (event) => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError("Enter the email and password for this browser.");
      return;
    }
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    navigate(next, { replace: true });
  };

  return (
    <AuthShell
      mode="login"
      title="Welcome back"
      lead="Sign in to open the shop. Your cart stays with this login."
    >
      <form className="form-grid" onSubmit={submit} noValidate>
        <label className="field">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@college.edu"
          />
        </label>
        <label className="field">
          Password
          <span className="pass-wrap">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            <button type="button" className="pass-toggle" onClick={() => setShow((value) => !value)}>
              {show ? "Hide" : "Show"}
            </button>
          </span>
        </label>
        {error ? <p className="err">{error}</p> : null}
        <button className="btn" type="submit">Log in</button>
        <p className="muted">Accounts stay in this browser. Nothing is sent to a server.</p>
      </form>
    </AuthShell>
  );
}
