import { useEffect, useState } from "react";
import "./Navbar.scss";

const NAV_LINKS = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#docs", label: "Docs" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <a href="#top" className="navbar__brand" onClick={closeMenu}>
          <span className="navbar__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
              <defs>
                <linearGradient id="navLogoGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#7C5CFF" />
                  <stop offset="1" stopColor="#4C8DFF" />
                </linearGradient>
              </defs>
              <path
                d="M4 12 L12 4 L20 12 L12 20 Z"
                fill="url(#navLogoGrad)"
              />
            </svg>
          </span>
          <span className="navbar__wordmark">Nova</span>
        </a>

        <nav className="navbar__links" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="navbar__link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="navbar__actions">
          <a href="#signin" className="navbar__signin">
            Sign in
          </a>
          <a href="#cta" className="btn btn--primary navbar__cta">
            Get started
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <button
          type="button"
          className={`navbar__toggle ${open ? "is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`navbar__sheet ${open ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby="mobile-menu-title"
      >
        <h2 className="sr-only" id="mobile-menu-title">
          Navigation
        </h2>
        <nav className="navbar__sheet-links" aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar__sheet-link"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="navbar__sheet-actions">
          <a href="#signin" className="btn btn--ghost" onClick={closeMenu}>
            Sign in
          </a>
          <a href="#cta" className="btn btn--primary" onClick={closeMenu}>
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
