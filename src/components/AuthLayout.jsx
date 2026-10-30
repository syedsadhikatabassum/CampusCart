import { Outlet } from "react-router-dom";
import { useStore } from "../context/store";
import { IconMoon, IconSun } from "./Icons";

export default function AuthLayout() {
  const { theme, toggleTheme } = useStore();

  return (
    <div className="auth-screen">
      <button
        type="button"
        className="theme-toggle auth-theme"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <IconSun /> : <IconMoon />}
        <span>{theme === "dark" ? "Light" : "Dark"}</span>
      </button>
      <Outlet />
    </div>
  );
}
