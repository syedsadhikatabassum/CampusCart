import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../context/store";
import {
  IconCart,
  IconClose,
  IconHeart,
  IconMenu,
  IconMoon,
  IconSun,
  IconUser,
} from "./Icons";
import Logo from "./Logo";
import SearchForm from "./SearchForm";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/shop", label: "Shop" },
  { to: "/categories", label: "Categories" },
  { to: "/wishlist", label: "Wishlist" },
  { to: "/cart", label: "Cart" },
];

export default function Header() {
  const { cartCount, wishItems, theme, toggleTheme, user, logout, openAuth } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const firstName = user?.name?.split(" ")[0] || "";
  const [open, setOpen] = useState(false);
  const closeMenu = () => setOpen(false);

  const guardCart = (event) => {
    if (user) return;
    event.preventDefault();
    closeMenu();
    openAuth({ reason: "cart", next: "/cart" });
  };

  const signOut = () => {
    const path = location.pathname;
    closeMenu();
    logout();
    if (path === "/account" || path === "/cart" || path === "/checkout") {
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-row">
        <Logo />
        <nav className="desktop-nav" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={link.to === "/cart" ? guardCart : closeMenu}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="tools">
          <SearchForm className="header-search" placeholder="Search stationery..." onSearch={closeMenu} />
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <IconSun /> : <IconMoon />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
          {user ? (
            <NavLink
              to="/account"
              className={({ isActive }) => `user-chip${isActive ? " active" : ""}`}
              aria-label={`${user.name} account`}
            >
              <IconUser />
              {firstName ? <span className="user-name">{firstName}</span> : null}
            </NavLink>
          ) : (
            <button type="button" className="login-btn" onClick={() => openAuth({ reason: "login" })}>
              Log in
            </button>
          )}
          <NavLink to="/wishlist" className={({ isActive }) => `icon-btn${isActive ? " active" : ""}`} aria-label="Wishlist">
            <IconHeart filled={wishItems.length > 0} />
            {wishItems.length > 0 ? <span className="badge-count">{wishItems.length}</span> : null}
          </NavLink>
          <NavLink to="/cart" onClick={guardCart} className={({ isActive }) => `icon-btn${isActive ? " active" : ""}`} aria-label="Cart">
            <IconCart />
            {cartCount > 0 ? <span className="badge-count">{cartCount}</span> : null}
          </NavLink>
          <button
            type="button"
            className="menu-btn"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>
      <div className="search-mobile container">
        <SearchForm className="header-search" placeholder="Search stationery..." onSearch={closeMenu} />
      </div>
      {open ? (
        <nav className="mobile-panel" aria-label="Mobile">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={link.to === "/cart" ? guardCart : closeMenu}
              className={({ isActive }) => (isActive ? "active" : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
          {user ? (
            <NavLink to="/account" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : undefined)}>
              Your details
            </NavLink>
          ) : (
            <button
              type="button"
              className="menu-link"
              onClick={() => {
                closeMenu();
                openAuth({ reason: "login" });
              }}
            >
              Log in
            </button>
          )}
          {user ? (
            <button type="button" className="menu-logout" onClick={signOut}>
              Sign out
            </button>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
