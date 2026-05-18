import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../services/api";
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

function FocusInput({ type = "text", value, onChange, placeholder, autoComplete = "off" }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      autoComplete={autoComplete}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%", boxSizing: "border-box", padding: "11px 14px",
        border: `1.5px solid ${focused ? "#1a3557" : "#e2e8f0"}`,
        borderRadius: 8, fontSize: 14, color: "#0f172a",
        background: "#fff", outline: "none",
        fontFamily: "'Segoe UI', sans-serif",
        transition: "border-color 0.15s",
      }}
    />
  );
}

function Field({ label, icon, error, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: "block", fontSize: 12, fontWeight: 700,
        color: "#475569", marginBottom: 6, letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}>
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
        {label}
      </label>
      {children}
      {error && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#ef4444", fontWeight: 500 }}>⚠ {error}</p>}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "", phone: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit phone required";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
      });
      if (res.success) {
        localStorage.setItem("sem_token", res.token);
        login(res.user);
        navigate("/", { replace: true });
      } else {
        setApiError(res.message || "Registration failed. Please try again.");
      }
    } catch {
      setApiError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      minHeight: "calc(100vh - 64px)", padding: "40px 24px",
      background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
        padding: "48px 40px", width: "100%", maxWidth: 460,
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 12, background: "#1a3557",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
          }}>
            <User size={24} color="#fff" strokeWidth={2.2} />
          </div>
          <h1 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 800, color: "#0f172a", fontFamily: "Georgia, serif" }}>
            Create Account
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: "#64748b" }}>
            Register to participate in campus events
          </p>
        </div>

        {/* API Error */}
        {apiError && (
          <div style={{
            background: "#fef2f2", border: "1px solid #fecaca",
            borderRadius: 8, padding: "10px 14px",
            fontSize: 13, color: "#ef4444", fontWeight: 600, marginBottom: 20,
          }}>
            <AlertCircle size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off">
          <Field label="Full Name" icon={<User size={12} />} error={errors.name}>
            <FocusInput
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Rahul Sharma"
              autoComplete="name"
            />
          </Field>

          <Field label="Email Address" icon={<Mail size={12} />} error={errors.email}>
            <FocusInput
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="rahul@example.com"
              autoComplete="email"
            />
          </Field>

          <Field label="Phone Number" icon={<Phone size={12} />} error={errors.phone}>
            <FocusInput
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="98XXXXXXXX"
              autoComplete="tel"
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Field label="Password" icon={<Lock size={12} />} error={errors.password}>
              <div style={{ position: "relative" }}>
                <FocusInput
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="Min 6 chars"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPass((v) => !v)} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 12, color: "#94a3b8",
                }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </Field>
            <Field label="Confirm" error={errors.confirmPassword}>
              <FocusInput
                type={showPass ? "text" : "password"}
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                placeholder="Repeat password"
                autoComplete="new-password"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", padding: "13px 0",
              background: loading ? "#94a3b8" : "#1a3557",
              color: "#fff", border: "none", borderRadius: 8,
              fontWeight: 800, fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Segoe UI', sans-serif",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "background 0.2s", marginTop: 8,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#0f2440"; }}
            onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#1a3557"; }}
          >
            {loading ? (
              <>
                <span style={{ width: 16, height: 16, border: "2px solid #ffffff60", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />
                Creating Account...
              </>
            ) : "Create Account →"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>ALREADY HAVE AN ACCOUNT?</span>
          <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            width: "100%", padding: "12px 0",
            background: "transparent", border: "1.5px solid #1a3557",
            borderRadius: 8, color: "#1a3557",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            fontFamily: "'Segoe UI', sans-serif", transition: "all 0.2s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#1a3557"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#1a3557"; }}
        >
          ← Go Back
        </button>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}