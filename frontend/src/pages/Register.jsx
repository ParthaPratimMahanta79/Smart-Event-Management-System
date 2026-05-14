import { useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

  :root {
    --navy: #1a2235;
    --navy-light: #243047;
    --blue-accent: #4a7cf7;
    --blue-hover: #3a6be0;
    --white: #ffffff;
    --muted: rgba(255,255,255,0.55);
    --border: rgba(255,255,255,0.12);
    --input-bg: rgba(255,255,255,0.06);
    --error: #ff6b6b;
    --success: #4ade80;
  }

  .reg-overlay {
    position: fixed;
    inset: 0;
    background: rgba(10, 14, 26, 0.75);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.25s ease;
    padding: 20px;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px) scale(0.97); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .reg-card {
    background: var(--navy);
    border: 1px solid var(--border);
    border-radius: 16px;
    width: 100%;
    max-width: 460px;
    padding: 40px 40px 36px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(74,124,247,0.08);
    animation: slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    max-height: 90vh;
    overflow-y: auto;
  }

  .reg-card::-webkit-scrollbar { width: 4px; }
  .reg-card::-webkit-scrollbar-track { background: transparent; }
  .reg-card::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .reg-header {
    text-align: center;
    margin-bottom: 28px;
  }

  .reg-logo {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }

  .reg-logo-icon {
    width: 36px;
    height: 36px;
    background: var(--blue-accent);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: var(--white);
  }

  .reg-logo-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    color: var(--white);
  }

  .reg-logo-text span { font-weight: 300; }

  .reg-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 6px;
  }

  .reg-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--muted);
    margin: 0;
  }

  .reg-section-label {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    margin-top: 4px;
  }

  .reg-section-label::before,
  .reg-section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .reg-section-label span {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .reg-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .reg-field {
    margin-bottom: 16px;
  }

  .reg-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 7px;
  }

  .reg-input-wrap {
    position: relative;
  }

  .reg-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    font-size: 16px;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .reg-input {
    width: 100%;
    background: var(--input-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 11px 13px 11px 40px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--white);
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }

  .reg-input::placeholder { color: rgba(255,255,255,0.22); }

  .reg-input:focus {
    border-color: var(--blue-accent);
    background: rgba(74,124,247,0.06);
    box-shadow: 0 0 0 3px rgba(74,124,247,0.12);
  }

  .reg-input.error { border-color: var(--error); }
  .reg-input.valid { border-color: var(--success); }

  .reg-error { font-family: 'DM Sans', sans-serif; font-size: 11.5px; color: var(--error); margin-top: 4px; }

  .strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  .strength-seg {
    flex: 1;
    height: 3px;
    border-radius: 2px;
    background: rgba(255,255,255,0.1);
    transition: background 0.3s;
  }

  .strength-seg.weak { background: #ef4444; }
  .strength-seg.fair { background: #f59e0b; }
  .strength-seg.strong { background: #22c55e; }

  .strength-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    color: var(--muted);
    margin-top: 4px;
  }

  .eye-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--muted);
    cursor: pointer;
    font-size: 16px;
    padding: 0;
    transition: color 0.2s;
    display: flex;
    align-items: center;
  }
  .eye-btn:hover { color: var(--white); }

  .reg-terms {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 22px;
    margin-top: 4px;
  }

  .reg-terms-check {
    width: 16px;
    height: 16px;
    accent-color: var(--blue-accent);
    cursor: pointer;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .reg-terms-text {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.5;
  }

  .reg-terms-link {
    color: var(--blue-accent);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  .reg-terms-link:hover { opacity: 0.75; }

  .reg-btn {
    width: 100%;
    padding: 13px;
    background: var(--blue-accent);
    color: var(--white);
    border: none;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(74,124,247,0.35);
    letter-spacing: 0.02em;
  }

  .reg-btn:hover:not(:disabled) {
    background: var(--blue-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(74,124,247,0.45);
  }

  .reg-btn:disabled { opacity: 0.7; cursor: not-allowed; }

  .reg-btn-loader {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }

  .spinner {
    width: 15px; height: 15px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .reg-footer {
    text-align: center;
    margin-top: 20px;
  }

  .reg-footer p {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--muted);
    margin: 0;
  }

  .reg-footer-link {
    color: var(--blue-accent);
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 0;
    transition: opacity 0.2s;
  }
  .reg-footer-link:hover { opacity: 0.75; }

  .reg-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    color: var(--muted);
    width: 30px;
    height: 30px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: background 0.2s, color 0.2s;
  }
  .reg-close:hover { background: rgba(255,255,255,0.1); color: var(--white); }
`;

function getStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
const strengthClasses = ["", "weak", "fair", "strong", "strong"];

export default function Register({ onClose, onSwitchToLogin }) {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", password: "", confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(form.password);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.phone) e.phone = "Phone is required";
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone)) e.phone = "Invalid number";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    if (!agreed) e.terms = "You must accept the terms";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1600));
    setLoading(false);
    alert("Account created! Welcome aboard.");
    onClose?.();
  };

  const set = (field) => (ev) => {
    setForm(f => ({ ...f, [field]: ev.target.value }));
    setErrors(e => ({ ...e, [field]: "" }));
  };

  return (
    <>
      <style>{styles}</style>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      <div className="reg-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
        <div className="reg-card">
          <button className="reg-close" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" aria-hidden="true" />
          </button>

          <div className="reg-header">
            <div className="reg-logo">
              <div className="reg-logo-icon">
                <i className="ti ti-calendar-event" aria-hidden="true" />
              </div>
              <div className="reg-logo-text"><strong>Smart Event</strong> <span>Management</span></div>
            </div>
            <h2 className="reg-title">Create an Account</h2>
            <p className="reg-subtitle">Join thousands of event organizers</p>
          </div>

          <div className="reg-section-label"><span>Personal Info</span></div>

          <div className="reg-row">
            <div className="reg-field">
              <label className="reg-label">First Name</label>
              <div className="reg-input-wrap">
                <span className="reg-icon"><i className="ti ti-user" aria-hidden="true" /></span>
                <input className={`reg-input${errors.firstName ? " error" : ""}`}
                  type="text" placeholder="John" value={form.firstName} onChange={set("firstName")} />
              </div>
              {errors.firstName && <p className="reg-error">{errors.firstName}</p>}
            </div>

            <div className="reg-field">
              <label className="reg-label">Last Name</label>
              <div className="reg-input-wrap">
                <span className="reg-icon"><i className="ti ti-user" aria-hidden="true" /></span>
                <input className={`reg-input${errors.lastName ? " error" : ""}`}
                  type="text" placeholder="Doe" value={form.lastName} onChange={set("lastName")} />
              </div>
              {errors.lastName && <p className="reg-error">{errors.lastName}</p>}
            </div>
          </div>

          <div className="reg-field">
            <label className="reg-label">Email Address</label>
            <div className="reg-input-wrap">
              <span className="reg-icon"><i className="ti ti-mail" aria-hidden="true" /></span>
              <input className={`reg-input${errors.email ? " error" : ""}`}
                type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
            </div>
            {errors.email && <p className="reg-error">{errors.email}</p>}
          </div>

          <div className="reg-field">
            <label className="reg-label">Phone Number</label>
            <div className="reg-input-wrap">
              <span className="reg-icon"><i className="ti ti-phone" aria-hidden="true" /></span>
              <input className={`reg-input${errors.phone ? " error" : ""}`}
                type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} />
            </div>
            {errors.phone && <p className="reg-error">{errors.phone}</p>}
          </div>

          <div className="reg-section-label"><span>Security</span></div>

          <div className="reg-field">
            <label className="reg-label">Password</label>
            <div className="reg-input-wrap">
              <span className="reg-icon"><i className="ti ti-lock" aria-hidden="true" /></span>
              <input className={`reg-input${errors.password ? " error" : ""}`}
                type={showPass ? "text" : "password"}
                placeholder="Min 6 characters" value={form.password} onChange={set("password")} />
              <button className="eye-btn" onClick={() => setShowPass(s => !s)} aria-label={showPass ? "Hide password" : "Show password"}>
                <i className={`ti ${showPass ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
              </button>
            </div>
            {form.password && (
              <>
                <div className="strength-bar">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`strength-seg${strength >= i ? ` ${strengthClasses[strength]}` : ""}`} />
                  ))}
                </div>
                <p className="strength-label">{strengthLabels[strength]} password</p>
              </>
            )}
            {errors.password && <p className="reg-error">{errors.password}</p>}
          </div>

          <div className="reg-field">
            <label className="reg-label">Confirm Password</label>
            <div className="reg-input-wrap">
              <span className="reg-icon"><i className="ti ti-lock" aria-hidden="true" /></span>
              <input className={`reg-input${errors.confirmPassword ? " error" : ""}`}
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat your password" value={form.confirmPassword} onChange={set("confirmPassword")} />
              <button className="eye-btn" onClick={() => setShowConfirm(s => !s)} aria-label={showConfirm ? "Hide password" : "Show password"}>
                <i className={`ti ${showConfirm ? "ti-eye-off" : "ti-eye"}`} aria-hidden="true" />
              </button>
            </div>
            {errors.confirmPassword && <p className="reg-error">{errors.confirmPassword}</p>}
          </div>

          <div className="reg-terms">
            <input className="reg-terms-check" type="checkbox"
              checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(er => ({...er, terms: ""})); }} />
            <span className="reg-terms-text">
              I agree to the <button className="reg-terms-link">Terms of Service</button> and{" "}
              <button className="reg-terms-link">Privacy Policy</button>
            </span>
          </div>
          {errors.terms && <p className="reg-error" style={{marginBottom: 14}}>{errors.terms}</p>}

          <button className="reg-btn" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span className="reg-btn-loader"><span className="spinner" /> Creating account…</span>
              : "Create Account"}
          </button>

          <div className="reg-footer">
            <p>Already have an account?{" "}
              <button className="reg-footer-link" onClick={onSwitchToLogin}>Sign in</button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}