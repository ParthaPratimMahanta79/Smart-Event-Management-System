import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/api";


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // After login, go back to where user came from (e.g. Eventregister)
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Both fields are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      if (res.success) {
        // Store token separately for API calls
        localStorage.setItem("sem_token", res.token);
        login(res.user); // stores in AuthContext + localStorage
        navigate(from, { replace: true });
      } else {
        setError(res.message || "Invalid credentials.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = (focused) => ({
    width: "100%", boxSizing: "border-box",
    padding: "11px 14px",
    border: `1.5px solid ${focused ? "#1a3557" : "#e2e8f0"}`,
    borderRadius: 8, fontSize: 14,
    color: "#0f172a", background: "#fff",
    outline: "none", fontFamily: "'Segoe UI', sans-serif",
    transition: "border-color 0.15s",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>
    

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        minHeight: "calc(100vh - 64px)", padding: "40px 24px",
      }}>
        <div style={{
          background: "#fff", borderRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
          padding: "48px 40px", width: "100%", maxWidth: 440,
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: 12,
              background: "#1a3557",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#0f172a", fontFamily: "Georgia, serif" }}>
              Welcome Back
            </h1>
            <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
              Sign in to access Smart Event Management
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca",
              borderRadius: 8, padding: "10px 14px",
              fontSize: 13, color: "#ef4444", fontWeight: 600,
              marginBottom: 20,
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                📧 Email Address
              </label>
              <FocusInput
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
                🔒 Password
              </label>
              <div style={{ position: "relative" }}>
                <FocusInput
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: 13, color: "#94a3b8", fontWeight: 600,
                  }}
                >
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "13px 0",
                background: loading ? "#94a3b8" : "#1a3557",
                color: "#fff", border: "none", borderRadius: 8,
                fontWeight: 800, fontSize: 15, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Segoe UI', sans-serif",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0f2440"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1a3557"; }}
            >
              {loading ? (
                <>
                  <span style={{ width: 16, height: 16, border: "2px solid #ffffff60", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                  Signing in...
                </>
              ) : "Sign In →"}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
            <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>NEW USER?</span>
            <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          </div>

          {/* Register link */}
          <button
            onClick={() => navigate("/Register")}
            style={{
              width: "100%", padding: "12px 0",
              background: "transparent",
              border: "1.5px solid #1a3557",
              borderRadius: 8, color: "#1a3557",
              fontWeight: 700, fontSize: 14, cursor: "pointer",
              fontFamily: "'Segoe UI', sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1a3557"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a3557"; }}
          >
            Create an Account
          </button>

          {/* Committee / Admin hint */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 20, lineHeight: 1.6 }}>
            Committee members & Admins use their assigned credentials.<br />
            Contact your administrator if you can't log in.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

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
        border: `1.5px solid ${focused ? "#1a3557" : "#e2e8f0"}`,
        borderRadius: 8, fontSize: 14, color: "#0f172a",
        background: "#fff", outline: "none",
        fontFamily: "'Segoe UI', sans-serif",
        transition: "border-color 0.15s",
      }}
    />
  );
}