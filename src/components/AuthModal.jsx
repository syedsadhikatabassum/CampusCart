import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/store";
import { IconClose } from "./Icons";

const EMPTY_REGISTER = { name: "", email: "", password: "", confirm: "", college: "" };

function copyFor(prompt, mode) {
  if (mode === "register") {
    return {
      title: "Create your profile",
      lead: "Register on this browser. Your cart stays with this account.",
    };
  }
  if (prompt.reason === "add") {
    return {
      title: "Log in now",
      lead: "Sign in or register to add this item to your cart.",
    };
  }
  if (prompt.reason === "cart" || prompt.reason === "checkout") {
    return {
      title: "Log in now",
      lead: "Sign in or register to open your cart.",
    };
  }
  return {
    title: "Welcome back",
    lead: "Sign in to keep your cart with this account.",
  };
}

function AuthDialog({ prompt }) {
  const { closeAuth, login, register } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState(prompt.mode === "register" ? "register" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY_REGISTER);
  const [errors, setErrors] = useState({});
  const { title, lead } = copyFor(prompt, mode);
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.querySelector("input")?.focus();
  }, [mode]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") closeAuth();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [closeAuth]);

  const finish = (result) => {
    if (!result.ok) return;
    const next = prompt.next;
    closeAuth();
    if (next) navigate(next);
  };

  const submitLogin = (event) => {
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
    finish(result);
  };

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submitRegister = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (form.name.trim().length < 2) nextErrors.name = "Enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) nextErrors.email = "Enter a valid email.";
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters.";
    if (form.password !== form.confirm) nextErrors.confirm = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = register({
      name: form.name,
      email: form.email,
      password: form.password,
      college: form.college,
    });
    if (!result.ok) {
      setErrors({ email: result.message });
      return;
    }
    finish(result);
  };

  return (
    <div className="auth-modal" onClick={closeAuth}>
      <section
        className="auth-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        ref={dialogRef}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="auth-close" onClick={closeAuth} aria-label="Close">
          <IconClose />
        </button>
        <div className="auth-switch" role="tablist" aria-label="Account">
          <button type="button" className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>Log in</button>
          <button type="button" className={mode === "register" ? "on" : ""} onClick={() => setMode("register")}>Register</button>
        </div>
        <h2 id="auth-title">{title}</h2>
        <p className="lead">{lead}</p>
        {mode === "login" ? (
          <form className="form-grid" onSubmit={submitLogin} noValidate>
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
        ) : (
          <form className="form-grid" onSubmit={submitRegister} noValidate>
            <label className="field">
              Full name
              <input value={form.name} onChange={setField("name")} autoComplete="name" />
              {errors.name ? <span className="err">{errors.name}</span> : null}
            </label>
            <label className="field">
              Email
              <input type="email" value={form.email} onChange={setField("email")} autoComplete="email" placeholder="you@college.edu" />
              {errors.email ? <span className="err">{errors.email}</span> : null}
            </label>
            <label className="field">
              Password
              <span className="pass-wrap">
                <input
                  type={show ? "text" : "password"}
                  value={form.password}
                  onChange={setField("password")}
                  autoComplete="new-password"
                />
                <button type="button" className="pass-toggle" onClick={() => setShow((value) => !value)}>
                  {show ? "Hide" : "Show"}
                </button>
              </span>
              {errors.password ? <span className="err">{errors.password}</span> : null}
            </label>
            <label className="field">
              Confirm password
              <input
                type={show ? "text" : "password"}
                value={form.confirm}
                onChange={setField("confirm")}
                autoComplete="new-password"
              />
              {errors.confirm ? <span className="err">{errors.confirm}</span> : null}
            </label>
            <label className="field">
              College
              <input value={form.college} onChange={setField("college")} placeholder="Optional" />
            </label>
            <button className="btn" type="submit">Create account</button>
            <p className="muted">This demo keeps the account in local storage on this browser.</p>
          </form>
        )}
      </section>
    </div>
  );
}

export default function AuthModal() {
  const { authPrompt } = useStore();
  if (!authPrompt) return null;
  return <AuthDialog key={`${authPrompt.reason}-${authPrompt.next || ""}`} prompt={authPrompt} />;
}
