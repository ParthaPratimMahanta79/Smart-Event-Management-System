import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const C = {
  navy: "#0d1b2a",
  navyMid: "#1b2d45",
  navyDark: "#1a3557",
  blue: "#2563eb",
  text: "#e2e8f0",
  muted: "#94a3b8",
};

// Small helper: input that tracks its own focus for border color
function FocusInput({ type, value, onChange, placeholder }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: "11px 14px",
        border: `1.5px solid ${focused ? C.navyDark : "#e2e8f0"}`,
        borderRadius: 8, fontSize: 14, color: "#0f172a",
        background: "#fff", outline: "none",
        fontFamily: "'Segoe UI', sans-serif",
        transition: "border-color 0.15s",
      }}
    />
  );
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, login, isLoggedIn } = useAuth();

  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  // Login form state
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const setField = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    const fn = () => setDropOpen(false);
    document.addEventListener("click", fn);
    return () => document.removeEventListener("click", fn);
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") closeLogin(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, []);

  const openLogin = () => {
    setError("");
    setForm({ email: "", password: "" });
    setLoginOpen(true);
  };

  const closeLogin = () => {
    setLoginOpen(false);
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
}).then((r) => r.json());
      if (res.success) {
        localStorage.setItem("sem_token", res.token);
        login(res.user);
        closeLogin();
      } else {
        setError(res.message || "Invalid credentials.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 100);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getActive = () => {
    if (location.pathname === "/Events")   return "events";
    if (location.pathname === "/Gallery")  return "gallery";
    if (location.pathname === "/Register") return "register";
    return "home";
  };
  const active = getActive();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("sem_token");
    navigate("/");
  };

  const links = [
    { id: "home",     label: "Home",     fn: () => scrollTo("home") },
    { id: "events",   label: "Events",   fn: () => navigate("/Events") },
    { id: "gallery",  label: "Gallery",  fn: () => navigate("/Gallery") },
    { id: "calendar", label: "Calendar", fn: () => scrollTo("calendar") },
    { id: "contact",  label: "Contact",  fn: () => scrollTo("contact") },
  ];

  return (
    <>
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

        {/* Nav Links + Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {links.map(({ id, label, fn }) => (
            <button key={id} onClick={fn} style={{
              background: "none", border: "none", cursor: "pointer",
              color: active === id ? "#fff" : C.muted,
              fontWeight: active === id ? 700 : 500,
              fontSize: 15, padding: "8px 16px", borderRadius: 8,
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

          {/* Auth section */}
          {isLoggedIn ? (
            // Profile dropdown (logged in)
            <div style={{ position: "relative", marginLeft: 8 }} onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setDropOpen((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8, padding: "6px 14px",
                  cursor: "pointer", color: "#fff",
                  fontFamily: "system-ui", fontSize: 14, fontWeight: 600,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
              >
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: C.blue,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700,
                }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                {user?.name?.split(" ")[0]}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                  style={{ transform: dropOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {dropOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#fff", borderRadius: 10,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                  minWidth: 180, overflow: "hidden",
                  border: "1px solid #e2e8f0", zIndex: 1000,
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid #f1f5f9" }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#0f172a" }}>{user?.name}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, color: "#94a3b8" }}>{user?.role}</p>
                  </div>
                  {user?.role === "admin" && (
                    <button onClick={() => { setDropOpen(false); navigate("/AdminDashboard"); }} style={dropItemStyle}>
                      🛡 Admin Dashboard
                    </button>
                  )}
                  {user?.role === "committee" && (
                    <button onClick={() => { setDropOpen(false); navigate("/AdminDashboard"); }} style={dropItemStyle}>
                      📋 Committee Dashboard
                    </button>
                  )}
                  <button onClick={() => { setDropOpen(false); navigate("/Events"); }} style={dropItemStyle}>
                    📅 My Registrations
                  </button>
                  <div style={{ borderTop: "1px solid #f1f5f9" }}>
                    <button onClick={handleLogout} style={{ ...dropItemStyle, color: "#ef4444" }}>
                      🚪 Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Single Login button → opens modal
            <button
              onClick={openLogin}
              style={{
                marginLeft: 8,
                padding: "7px 22px", background: C.blue,
                border: "none", borderRadius: 8, color: "#fff",
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                fontFamily: "system-ui", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#1d4ed8"}
              onMouseLeave={(e) => e.currentTarget.style.background = C.blue}
            >
              Login
            </button>
          )}
        </div>
      </nav>

      {/* ── Login Modal Overlay ── */}
      {loginOpen && (
        <div
          onClick={closeLogin}
          style={{
            position: "fixed", inset: 0, zIndex: 1100,
            background: "rgba(13,27,42,0.65)",
            backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24,
            animation: "fadeIn 0.18s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 20,
              boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
              padding: "44px 40px", width: "100%", maxWidth: 420,
              animation: "slideUp 0.22s ease",
              position: "relative",
            }}
          >
            {/* Close button */}
            <button
              onClick={closeLogin}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "#f1f5f9", border: "none", borderRadius: "50%",
                width: 32, height: 32, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 15, color: "#64748b", transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#e2e8f0"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#f1f5f9"}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: C.navyDark,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 14px",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "Georgia, serif" }}>
                Welcome Back
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                Sign in to Smart Event Management
              </p>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#ef4444", fontWeight: 600,
                marginBottom: 18,
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>📧 Email Address</label>
                <FocusInput
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>🔒 Password</label>
                <div style={{ position: "relative" }}>
                  <FocusInput
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    style={{
                      position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      fontSize: 12, color: "#94a3b8", fontWeight: 600,
                    }}
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", padding: "13px 0",
                  background: loading ? "#94a3b8" : C.navyDark,
                  color: "#fff", border: "none", borderRadius: 8,
                  fontWeight: 800, fontSize: 15,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Segoe UI', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0f2440"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = C.navyDark; }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 16, height: 16,
                      border: "2px solid #ffffff60", borderTop: "2px solid #fff",
                      borderRadius: "50%", display: "inline-block",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    Signing in...
                  </>
                ) : "Sign In →"}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>NEW USER?</span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            </div>

            {/* Register button */}
            <button
              onClick={() => { closeLogin(); navigate("/Register"); }}
              style={{
                width: "100%", padding: "12px 0",
                background: "transparent",
                border: `1.5px solid ${C.navyDark}`,
                borderRadius: 8, color: C.navyDark,
                fontWeight: 700, fontSize: 14, cursor: "pointer",
                fontFamily: "'Segoe UI', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = C.navyDark; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.navyDark; }}
            >
              Don't have an account? Register
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 18, lineHeight: 1.6 }}>
              Committee members & Admins use their assigned credentials.
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </>
  );
}

const dropItemStyle = {
  width: "100%", padding: "10px 16px",
  background: "none", border: "none",
  textAlign: "left", cursor: "pointer",
  fontSize: 13, fontWeight: 600,
  color: "#0f172a", fontFamily: "system-ui",
  display: "block", transition: "background 0.15s",
};

const labelStyle = {
  display: "block", fontSize: 12, fontWeight: 700,
  color: "#475569", marginBottom: 6,
  letterSpacing: "0.04em", textTransform: "uppercase",
};