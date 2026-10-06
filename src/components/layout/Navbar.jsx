import { useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLang } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";

import "./Navbar.css";

export default function Navbar() {
  const { t, lang, setLang, languages } = useLang();
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, displayName, signOut } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const pathname = window.location.pathname;
  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      window.location.href = "/";
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <span className="logo-narx">Narx</span>
          <span className="logo-top">Top</span>
        </a>

        {/* Search */}
        <form className="navbar-search" action="/search">
          <input
            type="text"
            name="q"
            placeholder={t("nav.searchPlaceholder")}
          />

          <button type="submit" aria-label={t("nav.search")}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </button>
        </form>

        {/* Navigation */}
        <nav className={`navbar-menu ${menuOpen ? "open" : ""}`}>
          <a
            href="/"
            className={`navbar-link ${isActive("/") ? "active" : ""}`}
          >
            {t("nav.home")}
          </a>

          <a
            href="/search"
            className={`navbar-link ${isActive("/search") ? "active" : ""}`}
          >
            {t("nav.search")}
          </a>

          <a
            href="/cart"
            className={`navbar-link navbar-cart ${
              isActive("/cart") ? "active" : ""
            }`}
          >
            {t("nav.cart")}
            {count > 0 && (
              <span className="cart-badge" key={count}>
                {count}
              </span>
            )}
          </a>
        </nav>

        {/* Theme */}
        <button
          type="button"
          className="theme-button"
          aria-label={t("nav.theme")}
          title={t("nav.theme")}
          onClick={toggleTheme}
        >
          {isDark ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.5 6.5 0 0 0 21 12.8Z" />
            </svg>
          )}
        </button>

        {/* Language */}
        <div className="language-switcher">
          {languages.map((code) => (
            <button
              key={code}
              type="button"
              className={`language ${lang === code ? "active" : ""}`}
              onClick={() => setLang(code)}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Auth */}
        {isAuthenticated ? (
          <div className="navbar-user">
            <span className="navbar-avatar" aria-hidden="true">
              {(displayName[0] || "N").toUpperCase()}
            </span>
            <span className="navbar-username">
              {t("nav.hello", { name: displayName })}
            </span>
            <button
              type="button"
              className="navbar-auth-button navbar-logout"
              onClick={handleSignOut}
            >
              {t("nav.logout")}
            </button>
          </div>
        ) : (
          <a href="/auth" className="navbar-auth-button">
            {t("nav.login")}
          </a>
        )}

        {/* Mobile burger */}
        <button
          type="button"
          className="navbar-burger"
          aria-label="Menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
