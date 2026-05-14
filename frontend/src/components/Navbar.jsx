import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const C = {
  navy: "#0d1b2a",
  navyMid: "#1b2d45",
  blue: "#2563eb",
  text: "#e2e8f0",
  muted: "#94a3b8",
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (id) => {
    // If not on home page, navigate home first then scroll
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Determine active tab based on current route
  const getActive = () => {
    if (location.pathname === "/Events")  return "events";
    if (location.pathname === "/Gallery") return "gallery";
    return "home"; // default for "/" and others
  };
  const active = getActive();

  const links = [
    { id: "home",     label: "Home",     fn: () => scrollTo("home") },
    { id: "events",   label: "Events",   fn: () => navigate("/Events") },
    { id: "gallery",  label: "Gallery",  fn: () => navigate("/Gallery") },
    { id: "calendar", label: "Calendar", fn: () => scrollTo("calendar") },
    { id: "contact",  label: "Contact",  fn: () => scrollTo("contact") },
  ];

  return (
    <nav style={{
      position: "sticky", top: 0, left: 0, right: 0, zIndex: 999, height: 64,
      background: scrolled ? "rgba(13,27,42,0.96)" : "rgba(13,27,42,0.85)",
      backdropFilter: "blur(10px)",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      transition: "all 0.3s",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 40px", boxSizing: "border-box",
    }}>
      {/* Logo */}
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        onClick={() => scrollTo("home")}
      >
        <div style={{
          width: 34, height: 34, borderRadius: 8, background: C.blue,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#fff", fontFamily: "Georgia, serif" }}>
          Smart Event <span style={{ fontWeight: 400 }}>Management</span>
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: 2 }}>
        {links.map(({ id, label, fn }) => (
          <button key={id} onClick={fn} style={{
            background: "none", border: "none", cursor: "pointer",
            color: active === id ? "#fff" : C.muted,
            fontWeight: active === id ? 700 : 500,
            fontSize: 15, padding: "8px 18px", borderRadius: 8,
            fontFamily: "system-ui, sans-serif", transition: "color 0.2s",
            position: "relative",
          }}>
            {label}
            {active === id && (
              <span style={{
                position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
                width: 20, height: 2.5, borderRadius: 2, background: C.blue, display: "block",
              }}/>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}