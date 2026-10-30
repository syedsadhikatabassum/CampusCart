import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useStore } from "../context/store";
import { usePageTitle } from "../hooks/usePageTitle";
import { safeNext } from "../utils";
import AuthShell from "../components/AuthShell";

const EMPTY = { name: "", email: "", password: "", confirm: "", college: "" };

export default function RegisterPage() {
  const { register } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState(EMPTY);
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  usePageTitle("Register");

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
  };

  const submit = (event) => {
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
    navigate(next, { replace: true });
  };

  return (
    <AuthShell
      mode="register"
      title="Create your profile"
      lead="Create a profile on this device. The shop opens after you register."
    >
      <form className="form-grid" onSubmit={submit} noValidate>
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
    </AuthShell>
  );
}
