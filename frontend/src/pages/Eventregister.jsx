import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ALL_EVENTS, COMMITTEES } from "../data/eventsData";
import { registerForEvent, getEvent } from "../services/api";
import {
  Lock, Loader2, Search, CheckCircle2, AlertTriangle,
  User, Mail, Phone, GraduationCap, Building2, Calendar,
  MapPin, Clock, Star, Users,
} from "lucide-react";

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

const getUserKey = (userId) => `sem_registered_${userId}`;

const markRegistered = (userId, id) => {
  if (!userId) return;
  try {
    const ids = JSON.parse(localStorage.getItem(getUserKey(userId)) || "[]");
    if (!ids.includes(String(id))) {
      localStorage.setItem(getUserKey(userId), JSON.stringify([...ids, String(id)]));
    }
  } catch {}
};

const isAlreadyRegistered = (userId, id) => {
  if (!userId) return false;
  try {
    const ids = JSON.parse(localStorage.getItem(getUserKey(userId)) || "[]");
    return ids.includes(String(id));
  } catch { return false; }
};

// Convert a DB event to the shape expected by this form
const normalizeDbEvent = (e) => {
  const date = new Date(e.date);
  return {
    id: e._id,
    title: e.title,
    category: e.category,
    committee: e.organizer?.name || "Unknown Committee",
    day: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("en-IN", { month: "short" }),
    time: e.time,
    location: e.venue,
    description: e.description,
    image: e.image ? `http://localhost:5001${e.image}` : "",
    isTeam: false,
    _status: e.status,
    _fromDb: true,
  };
};

function Field({ label, icon, error, children }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, letterSpacing: "0.04em", textTransform: "uppercase" }}>
        {icon && <span style={{ marginRight: 6, verticalAlign: "middle" }}>{icon}</span>}{label}
      </label>
      {children}
      {error && <p style={{ margin: "4px 0 0", fontSize: 11, color: "#ef4444", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}><AlertTriangle size={12} /> {error}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, disabled, type = "text" }) {
  const [focus, setFocus] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
      onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
      style={{
        width: "100%", boxSizing: "border-box", padding: "10px 14px",
        border: `1.5px solid ${focus ? "#1a3557" : "#e2e8f0"}`,
        borderRadius: 8, fontSize: 13,
        color: disabled ? "#94a3b8" : "#0f172a",
        background: disabled ? "#f8fafc" : "#fff",
        outline: "none", fontFamily: "'Segoe UI', sans-serif",
        transition: "border-color 0.15s",
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

function SelectInput({ value, onChange, options, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)} style={{
      width: "100%", boxSizing: "border-box", padding: "10px 14px",
      border: `1.5px solid ${focus ? "#1a3557" : "#e2e8f0"}`,
      borderRadius: 8, fontSize: 13, color: value ? "#0f172a" : "#94a3b8",
      background: "#fff", outline: "none", fontFamily: "'Segoe UI', sans-serif",
      transition: "border-color 0.15s", cursor: "pointer", appearance: "none",
      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
    }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function SectionLabel({ children, extra }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 800, color: "#1a3557", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 3, height: 14, background: "#1a3557", borderRadius: 2 }} />
      {children}
      {extra && <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: 10 }}>{extra}</span>}
    </div>
  );
}

export default function EventRegister() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loadingEvent, setLoadingEvent] = useState(true);

  // First try static data, then fall back to backend
  useEffect(() => {
    const staticEvent = ALL_EVENTS.find(e => String(e.id) === String(id));
    if (staticEvent) {
      setEvent(staticEvent);
      setLoadingEvent(false);
    } else {
      // Try fetching from backend (DB event)
      getEvent(id)
        .then(res => {
          if (res.success && res.event) {
            setEvent(normalizeDbEvent(res.event));
          } else {
            setEvent(null);
          }
        })
        .catch(() => setEvent(null))
        .finally(() => setLoadingEvent(false));
    }
  }, [id]);

  const committeeInfo = event ? (COMMITTEES[event.committee] || { icon: <Star size={14} />, color: "#1a3557" }) : null;
  const alreadyRegistered = event ? isAlreadyRegistered(user?.id, id) : false;

  const [isTeamEvent, setIsTeamEvent] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    studentId: "", department: "", year: "",
    teamName: "", members: [{ name: "", studentId: "", department: "" }],
  });
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError]     = useState("");

  // Prefill form once user is known
  useEffect(() => {
    if (user) {
      setForm(f => ({
        ...f,
        firstName: user.name?.split(" ")[0] || "",
        lastName:  user.name?.split(" ").slice(1).join(" ") || "",
        email:     user.email || "",
        phone:     user.phone || "",
      }));
    }
  }, [user]);

  // Set isTeamEvent once event loads
  useEffect(() => {
    if (event) setIsTeamEvent(event.isTeam || false);
  }, [event]);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", background: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "48px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16, display: "flex", justifyContent: "center" }}><Lock size={48} color="#1a3557" /></div>
          <h2 style={{ color: "#0f172a", marginBottom: 8, fontFamily: "Georgia, serif" }}>Login Required</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>You need to be logged in to register for events.</p>
          <button onClick={() => navigate("/Login", { state: { from: `/Eventregister/${id}` } })}
            style={{ width: "100%", padding: "12px 0", background: "#1a3557", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", marginBottom: 12 }}>
            Login to Continue
          </button>
          <button onClick={() => navigate("/Events")}
            style={{ width: "100%", padding: "12px 0", background: "transparent", border: "1.5px solid #1a3557", borderRadius: 8, color: "#1a3557", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
            ← Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (loadingEvent) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: 32, marginBottom: 12, display: "flex", justifyContent: "center" }}><Loader2 size={32} style={{ animation: "spin 0.8s linear infinite" }} /></div>
          <p>Loading event...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", background: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><Search size={48} color="#94a3b8" /></div>
          <h2 style={{ color: "#0f172a", marginBottom: 8 }}>Event Not Found</h2>
          <p style={{ color: "#64748b", marginBottom: 24 }}>This event doesn't exist or has been removed.</p>
          <button onClick={() => navigate("/Events")} style={{ padding: "10px 28px", background: "#1a3557", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Back to Events</button>
        </div>
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", background: "#f5f6fa", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', sans-serif" }}>
        <div style={{ textAlign: "center", background: "#fff", borderRadius: 16, padding: "48px 40px", boxShadow: "0 8px 40px rgba(0,0,0,0.1)", maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 16, display: "flex", justifyContent: "center" }}><CheckCircle2 size={48} color="#22c55e" /></div>
          <h2 style={{ color: "#0f172a", marginBottom: 8, fontFamily: "Georgia, serif" }}>Already Registered</h2>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>You have already registered for <strong>{event.title}</strong>.</p>
          <button onClick={() => navigate("/Events")} style={{ width: "100%", padding: "12px 0", background: "#1a3557", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>← Back to Events</button>
        </div>
      </div>
    );
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const updateMember = (idx, key, val) => {
    const members = [...form.members];
    members[idx] = { ...members[idx], [key]: val };
    setForm(f => ({ ...f, members }));
  };
  const addMember    = () => { if (form.members.length < 5) setForm(f => ({ ...f, members: [...f.members, { name: "", studentId: "", department: "" }] })); };
  const removeMember = (idx) => setForm(f => ({ ...f, members: f.members.filter((_, i) => i !== idx) }));

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

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true); setApiError("");
    try {
      const payload = {
        committeeName: event.committee,
        eventTitle:    event.title,
        firstName:  form.firstName,
        lastName:   form.lastName,
        email:      form.email,
        phone:      form.phone,
        studentId:  form.studentId,
        department: form.department,
        year:       form.year,
        isTeam:     isTeamEvent,
        ...(isTeamEvent && { teamName: form.teamName, members: form.members }),
      };
      const res = await registerForEvent(id, payload);
      if (!res.success) { setApiError(res.message || "Registration failed."); setSubmitting(false); return; }
      markRegistered(user?.id, id);
      navigate("/Events");
    } catch {
      setApiError("Network error. Please check your connection and try again.");
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif", paddingBottom: 60 }}>
      <div style={{ background: "#1a3557", padding: "28px 40px 24px", borderBottom: `4px solid ${committeeInfo.color}` }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <button onClick={() => navigate("/Events")} style={{ background: "none", border: "none", color: "#93c5fd", fontSize: 13, fontWeight: 600, cursor: "pointer", padding: 0, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>← Back to Events</button>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: committeeInfo.color + "25", border: `1.5px solid ${committeeInfo.color}50`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 700, color: committeeInfo.color, marginBottom: 10 }}>
            <span>{committeeInfo.icon}</span>{event.committee}
            <span style={{ background: committeeInfo.color + "30", fontSize: 10, padding: "1px 7px", borderRadius: 10, fontWeight: 800, marginLeft: 2 }}>ORGANIZER</span>
          </div>
          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "'Georgia', serif", letterSpacing: "-0.4px" }}>{event.title}</h1>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <span style={{ color: "#93c5fd", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><Calendar size={13} /> {event.day} {event.month}</span>
            <span style={{ color: "#93c5fd", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><Clock size={13} /> {event.time}</span>
            <span style={{ color: "#93c5fd", fontSize: 13, display: "flex", alignItems: "center", gap: 5 }}><MapPin size={13} /> {event.location}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "36px auto 0", padding: "0 24px" }}>
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", overflow: "hidden" }}>

          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9" }}>
            <SectionLabel>Personal Information</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="First Name" icon={<User size={12} />} error={errors.firstName}><TextInput value={form.firstName} onChange={e => set("firstName", e.target.value)} placeholder="Rahul" /></Field>
              <Field label="Last Name" error={errors.lastName}><TextInput value={form.lastName} onChange={e => set("lastName", e.target.value)} placeholder="Sharma" /></Field>
            </div>
            <Field label="Email Address" icon={<Mail size={12} />} error={errors.email}><TextInput type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="rahul@example.com" /></Field>
            <Field label="Phone Number" icon={<Phone size={12} />} error={errors.phone}><TextInput type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="98XXXXXXXX" /></Field>
          </div>

          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9" }}>
            <SectionLabel>Academic Details</SectionLabel>
            <Field label="Student ID / Roll No" icon={<GraduationCap size={12} />} error={errors.studentId}><TextInput value={form.studentId} onChange={e => set("studentId", e.target.value)} placeholder="DEC/2022/001" /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="Department" icon={<Building2 size={12} />} error={errors.department}><SelectInput value={form.department} onChange={e => set("department", e.target.value)} options={DEPARTMENTS} placeholder="Select department" /></Field>
              <Field label="Year" icon={<Calendar size={12} />} error={errors.year}><SelectInput value={form.year} onChange={e => set("year", e.target.value)} options={YEARS} placeholder="Select year" /></Field>
            </div>
          </div>

          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
            <SectionLabel extra="AUTO-FILLED">Event Details</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
              <Field label="Event Name" icon={<Star size={12} />}><TextInput value={event.title} disabled /></Field>
              <Field label="Organizing Committee" icon={<Building2 size={12} />}>
                <div style={{ padding: "10px 14px", border: `1.5px solid ${committeeInfo.color}40`, borderRadius: 8, fontSize: 13, background: committeeInfo.color + "08", color: committeeInfo.color, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{committeeInfo.icon}</span>{event.committee}
                  <span style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600, marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}><Lock size={10} /> Locked</span>
                </div>
              </Field>
            </div>
          </div>

          <div style={{ padding: "28px 32px", borderBottom: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isTeamEvent ? 20 : 0 }}>
              <SectionLabel>Team Registration</SectionLabel>
              <div onClick={() => setIsTeamEvent(v => !v)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                <span style={{ fontSize: 12, color: "#64748b", fontWeight: 600 }}>{isTeamEvent ? "Team Event" : "Solo Event"}</span>
                <div style={{ width: 42, height: 22, borderRadius: 11, background: isTeamEvent ? "#1a3557" : "#e2e8f0", position: "relative", transition: "background 0.2s" }}>
                  <div style={{ position: "absolute", top: 3, left: isTeamEvent ? 22 : 3, width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transition: "left 0.2s" }} />
                </div>
              </div>
            </div>
            {isTeamEvent && (
              <div>
                <Field label="Team Name" icon={<Users size={12} />} error={errors.teamName}><TextInput value={form.teamName} onChange={e => set("teamName", e.target.value)} placeholder="Team Phoenix" /></Field>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 12, marginTop: 8 }}>Team Members ({form.members.length}/5)</div>
                {form.members.map((m, i) => (
                  <div key={i} style={{ background: "#f8fafc", borderRadius: 10, border: "1px solid #e5e7eb", padding: "16px 18px", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#1a3557" }}>Member {i + 1}</span>
                      {form.members.length > 1 && <button onClick={() => removeMember(i)} style={{ background: "#fee2e2", border: "none", color: "#ef4444", borderRadius: 6, padding: "3px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Remove</button>}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                      <Field label="Full Name" error={errors[`member_${i}_name`]}><TextInput value={m.name} onChange={e => updateMember(i, "name", e.target.value)} placeholder="Member name" /></Field>
                      <Field label="Student ID" error={errors[`member_${i}_studentId`]}><TextInput value={m.studentId} onChange={e => updateMember(i, "studentId", e.target.value)} placeholder="Roll No." /></Field>
                    </div>
                    <Field label="Department" error={errors[`member_${i}_dept`]}><SelectInput value={m.department} onChange={e => updateMember(i, "department", e.target.value)} options={DEPARTMENTS} placeholder="Select department" /></Field>
                  </div>
                ))}
                {form.members.length < 5 && (
                  <button onClick={addMember} style={{ width: "100%", padding: "10px 0", background: "transparent", border: "1.5px dashed #cbd5e1", borderRadius: 8, fontSize: 13, color: "#64748b", cursor: "pointer", fontWeight: 600, fontFamily: "'Segoe UI', sans-serif" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#1a3557"; e.currentTarget.style.color = "#1a3557"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#64748b"; }}>
                    + Add Team Member
                  </button>
                )}
              </div>
            )}
            {!isTeamEvent && <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>This is a solo event. Toggle above if you want to register as a team.</p>}
          </div>

          <div style={{ padding: "24px 32px" }}>
            {Object.keys(errors).length > 0 && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={13} /> Please fix the errors above before submitting.
              </div>
            )}
            {apiError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 16px", fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
                <AlertTriangle size={13} /> {apiError}
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting} style={{
              width: "100%", padding: "14px 0",
              background: submitting ? "#94a3b8" : "#1a3557",
              color: "#fff", border: "none", borderRadius: 8,
              fontWeight: 800, fontSize: 15, cursor: submitting ? "not-allowed" : "pointer",
              fontFamily: "'Segoe UI', sans-serif", transition: "background 0.2s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
            }}
              onMouseEnter={e => { if (!submitting) e.currentTarget.style.background = "#0f2440"; }}
              onMouseLeave={e => { if (!submitting) e.currentTarget.style.background = "#1a3557"; }}
            >
              {submitting
                ? <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />Submitting...</>
                : <>Submit Registration →</>}
            </button>
            <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", marginTop: 12 }}>
              By submitting, you agree to the event rules set by {event.committee}.
            </p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}