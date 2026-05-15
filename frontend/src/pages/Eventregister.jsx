import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ALL_EVENTS, COMMITTEES } from "../data/eventsData";

const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Information Technology",
  "Applied Electronics & Instrumentation",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

// ─── Input field component ────────────────────────────────────────────────────
function Field({ label, icon, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{
        display: "block", fontSize: 12, fontWeight: 700,
        color: "#475569", marginBottom: 6, letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}>
        {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
        {label}
      </label>
      {children}
      {error && (
        <p style={{ margin: "4px 0 0", fontSize: 11, color: "#ef4444", fontWeight: 500 }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled, type = "text" }) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: "10px 14px",
        border: `1.5px solid ${focus ? "#1a3557" : "#e2e8f0"}`,
        borderRadius: 8, fontSize: 13,
        color: disabled ? "#94a3b8" : "#0f172a",
        background: disabled ? "#f8fafc" : "#fff",
        outline: "none",
        fontFamily: "'Segoe UI', sans-serif",
        transition: "border-color 0.15s",
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <select
      value={value}
      onChange={onChange}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: "10px 14px",
        border: `1.5px solid ${focus ? "#1a3557" : "#e2e8f0"}`,
        borderRadius: 8, fontSize: 13, color: value ? "#0f172a" : "#94a3b8",
        background: "#fff", outline: "none",
        fontFamily: "'Segoe UI', sans-serif",
        transition: "border-color 0.15s",
        cursor: "pointer",
        appearance: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 14px center",
      }}
    >
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────
function SuccessScreen({ event, onBack }) {
  const committeeInfo = COMMITTEES[event.committee] || { icon: "🏫", color: "#1a3557" };
  return (
    <div style={{
      minHeight: "100vh", background: "#f5f6fa",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16,
        boxShadow: "0 8px 40px rgba(0,0,0,0.1)",
        padding: "56px 48px", textAlign: "center",
        maxWidth: 480, width: "100%",
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          background: "#dcfce7", display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 36, margin: "0 auto 24px",
        }}>✅</div>

        <h2 style={{
          margin: "0 0 8px", fontSize: 24, fontWeight: 800,
          color: "#0f172a", fontFamily: "'Georgia', serif",
        }}>
          Registration Successful!
        </h2>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          You've successfully registered for <strong>{event.title}</strong>. We'll send a confirmation to your email shortly.
        </p>

        <div style={{
          background: committeeInfo.color + "10",
          border: `1.5px solid ${committeeInfo.color}30`,
          borderRadius: 10, padding: "14px 20px",
          marginBottom: 28, textAlign: "left",
        }}>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Event Details</div>
          <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>{event.title}</div>
          <div style={{ fontSize: 12, color: committeeInfo.color, fontWeight: 700, marginTop: 4 }}>
            {committeeInfo.icon} {event.committee}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>
            📅 {event.day} {event.month} &nbsp;·&nbsp; 🕐 {event.time}
          </div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
            📍 {event.location}
          </div>
        </div>

        <button
          onClick={onBack}
          style={{
            width: "100%", padding: "12px 0",
            background: "#1a3557", color: "#fff",
            border: "none", borderRadius: 8,
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          ← Back to Events
        </button>
      </div>
    </div>
  );
}

// ─── Main EventRegister Page ──────────────────────────────────────────────────
export default function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = ALL_EVENTS.find(e => String(e.id) === String(id));
  const committeeInfo = event ? (COMMITTEES[event.committee] || { icon: "🏫", color: "#1a3557" }) : null;

  const [submitted, setSubmitted] = useState(false);
  const [isTeamEvent, setIsTeamEvent] = useState(event?.isTeam || false);
  const [form, setForm] = useState({
    firstName: "", lastName: "",
    email: "", phone: "",
    studentId: "", department: "", year: "",
    teamName: "",
    members: [{ name: "", studentId: "", department: "" }],
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const updateMember = (idx, key, val) => {
    const members = [...form.members];
    members[idx] = { ...members[idx], [key]: val };
    setForm(f => ({ ...f, members }));
  };

  const addMember = () => {
    if (form.members.length < 5) {
      setForm(f => ({ ...f, members: [...f.members, { name: "", studentId: "", department: "" }] }));
    }
  };

  const removeMember = (idx) => {
    setForm(f => ({ ...f, members: f.members.filter((_, i) => i !== idx) }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim())  e.lastName  = "Last name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email is required";
    if (!form.phone.trim() || !/^\d{10}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Valid 10-digit phone is required";
    if (!form.studentId.trim()) e.studentId = "Student ID / Roll No is required";
    if (!form.department)       e.department = "Department is required";
    if (!form.year)             e.year = "Year is required";
    if (isTeamEvent && !form.teamName.trim()) e.teamName = "Team name is required";
    if (isTeamEvent) {
      form.members.forEach((m, i) => {
        if (!m.name.trim())      e[`member_${i}_name`]      = "Member name is required";
        if (!m.studentId.trim()) e[`member_${i}_studentId`] = "Student ID is required";
        if (!m.department)       e[`member_${i}_dept`]      = "Department is required";
      });
    }
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1200);
  };

  if (!event) {
    return (
      <div style={{
        minHeight: "100vh", background: "#f5f6fa",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 48 }}>🔍</div>
          <h2 style={{ color: "#0f172a", marginBottom: 8 }}>Event Not Found</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>This event doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate("/Events")}
            style={{
              padding: "10px 28px", background: "#1a3557", color: "#fff",
              border: "none", borderRadius: 8, fontWeight: 700,
              fontSize: 14, cursor: "pointer",
            }}
          >
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (submitted) return <SuccessScreen event={event} onBack={() => navigate("/Events")} />;

  return (
    <div style={{
      minHeight: "100vh", background: "#f5f6fa",
      fontFamily: "'Segoe UI', sans-serif",
      paddingBottom: 60,
    }}>

      {/* ── Top banner ── */}
      <div style={{
        background: "#1a3557",
        padding: "28px 40px 24px",
        borderBottom: `4px solid ${committeeInfo.color}`,
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <button
            onClick={() => navigate("/Events")}
            style={{
              background: "none", border: "none",
              color: "#93c5fd", fontSize: 13, fontWeight: 600,
              cursor: "pointer", padding: 0, marginBottom: 16,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            ← Back to Events
          </button>

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            background: committeeInfo.color + "25",
            border: `1.5px solid ${committeeInfo.color}50`,
            borderRadius: 20, padding: "5px 14px",
            fontSize: 12, fontWeight: 700, color: committeeInfo.color,
            marginBottom: 10,
          }}>
            <span>{committeeInfo.icon}</span>
            {event.committee}
            <span style={{
              background: committeeInfo.color + "30",
              fontSize: 10, padding: "1px 7px", borderRadius: 10,
              fontWeight: 800, marginLeft: 2,
            }}>
              ORGANIZER
            </span>
          </div>

          <h1 style={{
            margin: "0 0 8px", fontSize: 26, fontWeight: 800,
            color: "#fff", fontFamily: "'Georgia', serif",
            letterSpacing: "-0.4px",
          }}>
            {event.title}
          </h1>

          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ color: "#93c5fd", fontSize: 13 }}>📅 {event.day} {event.month}</span>
            <span style={{ color: "#93c5fd", fontSize: 13 }}>🕐 {event.time}</span>
            <span style={{ color: "#93c5fd", fontSize: 13 }}>📍 {event.location}</span>
          </div>
        </div>
      </div>

      {/* ── Form card ── */}
      <div style={{ maxWidth: 720, margin: "36px auto 0", padding: "0 24px" }}>
        <div style={{
          background: "#fff", borderRadius: 14,
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}>

          {/* Personal Info */}
          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: "#1a3557",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 3, height: 14, background: "#1a3557", borderRadius: 2 }} />
              Personal Information
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="First Name" icon="👤" error={errors.firstName}>
                <TextInput value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Rahul" />
              </Field>
              <Field label="Last Name" error={errors.lastName}>
                <TextInput value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Sharma" />
              </Field>
            </div>

            <Field label="Email Address" icon="📧" error={errors.email}>
              <TextInput type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="rahul@example.com" />
            </Field>

            <Field label="Phone Number" icon="📱" error={errors.phone}>
              <TextInput type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="98XXXXXXXX" />
            </Field>
          </div>

          {/* Academic Info */}
          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: "#1a3557",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 3, height: 14, background: "#1a3557", borderRadius: 2 }} />
              Academic Details
            </div>

            <Field label="Student ID / Roll No" icon="🎓" error={errors.studentId}>
              <TextInput value={form.studentId} onChange={e => set("studentId", e.target.value)} placeholder="DEC/2022/001" />
            </Field>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="Department" icon="🏛" error={errors.department}>
                <SelectInput
                  value={form.department}
                  onChange={e => set("department", e.target.value)}
                  options={DEPARTMENTS}
                  placeholder="Select department"
                />
              </Field>
              <Field label="Year" icon="📅" error={errors.year}>
                <SelectInput
                  value={form.year}
                  onChange={e => set("year", e.target.value)}
                  options={YEARS}
                  placeholder="Select year"
                />
              </Field>
            </div>
          </div>

          {/* Event Info (frozen) */}
          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
            <div style={{
              fontSize: 11, fontWeight: 800, color: "#1a3557",
              letterSpacing: "0.1em", textTransform: "uppercase",
              marginBottom: 20, display: "flex", alignItems: "center", gap: 8,
            }}>
              <div style={{ width: 3, height: 14, background: "#1a3557", borderRadius: 2 }} />
              Event Details
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#94a3b8",
                background: "#f1f5f9", padding: "2px 8px", borderRadius: 10,
              }}>
                AUTO-FILLED
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="Event Name" icon="🎪">
                <TextInput value={event.title} disabled />
              </Field>
              <Field label="Organizing Committee" icon="🏛">
                <div style={{
                  padding: "10px 14px",
                  border: `1.5px solid ${committeeInfo.color}40`,
                  borderRadius: 8, fontSize: 13,
                  background: committeeInfo.color + "08",
                  color: committeeInfo.color,
                  fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span>{committeeInfo.icon}</span>
                  {event.committee}
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginLeft: "auto" }}>🔒 Locked</span>
                </div>
              </Field>
            </div>
          </div>

          {/* Team */}
          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginBottom: isTeamEvent ? 20 : 0,
            }}>
              <div style={{
                fontSize: 11, fontWeight: 800, color: "#1a3557",
                letterSpacing: "0.1em", textTransform: "uppercase",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{ width: 3, height: 14, background: "#1a3557", borderRadius: 2 }} />
                Team Registration
              </div>

              <div onClick={() => setIsTeamEvent(v => !v)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                  {isTeamEvent ? "Team Event" : "Solo Event"}
                </span>
                <div style={{
                  width: 42, height: 22, borderRadius: 11,
                  background: isTeamEvent ? "#1a3557" : "#e2e8f0",
                  position: "relative", transition: "background 0.2s",
                }}>
                  <div style={{
                    position: "absolute", top: 3,
                    left: isTeamEvent ? 22 : 3,
                    width: 16, height: 16, borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    transition: "left 0.2s",
                  }} />
                </div>
              </div>
            </div>

            {isTeamEvent && (
              <div>
                <Field label="Team Name" icon="👥" error={errors.teamName}>
                  <TextInput value={form.teamName} onChange={e => set("teamName", e.target.value)} placeholder="Team Phoenix" />
                </Field>

                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12, marginTop: 8 }}>
                  Team Members ({form.members.length}/5)
                </div>

                {form.members.map((m, i) => (
                  <div key={i} style={{
                    background: "#f8fafc", borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    padding: "16px 18px", marginBottom: 12,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1a3557" }}>Member {i + 1}</span>
                      {form.members.length > 1 && (
                        <button
                          onClick={() => removeMember(i)}
                          style={{
                            background: "#fee2e2", border: "none",
                            color: "#ef4444", borderRadius: 6,
                            padding: "3px 10px", fontSize: 11,
                            fontWeight: 700, cursor: "pointer",
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                      <Field label="Full Name" error={errors[`member_${i}_name`]}>
                        <TextInput value={m.name} onChange={e => updateMember(i, "name", e.target.value)} placeholder="Member name" />
                      </Field>
                      <Field label="Student ID" error={errors[`member_${i}_studentId`]}>
                        <TextInput value={m.studentId} onChange={e => updateMember(i, "studentId", e.target.value)} placeholder="Roll No." />
                      </Field>
                    </div>

                    <Field label="Department" error={errors[`member_${i}_dept`]}>
                      <SelectInput
                        value={m.department}
                        onChange={e => updateMember(i, "department", e.target.value)}
                        options={DEPARTMENTS}
                        placeholder="Select department"
                      />
                    </Field>
                  </div>
                ))}

                {form.members.length < 5 && (
                  <button
                    onClick={addMember}
                    style={{
                      width: "100%", padding: "10px 0",
                      background: "transparent",
                      border: "1.5px dashed #cbd5e1",
                      borderRadius: 8, fontSize: 13,
                      color: "#64748b", cursor: "pointer",
                      fontWeight: 600, fontFamily: "'Segoe UI', sans-serif",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#1a3557"; e.currentTarget.style.color = "#1a3557"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#64748b"; }}
                  >
                    + Add Team Member
                  </button>
                )}
              </div>
            )}

            {!isTeamEvent && (
              <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>
                This is a solo event. Toggle above if you want to register as a team.
              </p>
            )}
          </div>

          {/* Submit */}
          <div style={{ padding: "24px 32px" }}>
            {Object.keys(errors).length > 0 && (
              <div style={{
                background: "#fef2f2", border: "1px solid #fecaca",
                borderRadius: 8, padding: "10px 16px",
                fontSize: 12, color: "#ef4444", fontWeight: 600,
                marginBottom: 16,
              }}>
                ⚠ Please fix the errors above before submitting.
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                width: "100%", padding: "14px 0",
                background: submitting ? "#94a3b8" : "#1a3557",
                color: "#fff", border: "none",
                borderRadius: 8, fontWeight: 800,
                fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
                fontFamily: "'Segoe UI', sans-serif",
                letterSpacing: "0.02em",
                transition: "background 0.2s",
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 10,
              }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#0f2440"; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#1a3557"; }}
            >
              {submitting ? (
                <>
                  <span style={{
                    width: 16, height: 16, border: "2px solid #ffffff60",
                    borderTop: "2px solid #fff", borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Submitting...
                </>
              ) : (
                <>Submit Registration →</>
              )}
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12 }}>
              By submitting, you agree to the event rules and terms set by {event.committee}.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}