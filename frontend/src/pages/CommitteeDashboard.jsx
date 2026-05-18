import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getCommitteeDashboard, getCommitteeRegistrations, getCommitteeEvents,
  createEvent, updateRegistrationStatus,
} from "../services/api";

const NAV = "#0d1b2a";
const ACCENT = "#2563eb";
const BORDER = "#e2e8f0";

// Must exactly match Event.js model enum
const CATEGORIES = ["Sports", "Technology", "Science", "Art", "Music", "Business", "Other"];

// Map committee name keywords to a default category
const getDefaultCategory = (committeeName = "") => {
  const name = committeeName.toLowerCase();
  if (name.includes("sport"))      return "Sports";
  if (name.includes("tech"))       return "Technology";
  if (name.includes("science"))    return "Science";
  if (name.includes("art"))        return "Art";
  if (name.includes("music") || name.includes("cultural")) return "Music";
  if (name.includes("business"))   return "Business";
  return "Other";
};

const fmt = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const statusColor = { upcoming: "#1d6fa4", ongoing: "#16a34a", completed: "#64748b", cancelled: "#ef4444" };
const regStatusColor = { approved: "#15803d", pending: "#d97706", rejected: "#ef4444" };

// ── SVG Icon components ───────────────────────────────────────────────────────
const IconCalendar = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const IconActivity = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

const IconClipboard = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
  </svg>
);

const IconUsers = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const IconClock = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const IconMapPin = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconImage = ({ size = 28, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

const IconAlertTriangle = ({ size = 13, color = "#ef4444" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconLoader = ({ size = 32, color = "#94a3b8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/>
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/>
    <line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/>
  </svg>
);

const IconInbox = ({ size = 36, color = "#94a3b8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
  </svg>
);

const IconBuilding = ({ size = 11, color = "#94a3b8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/>
    <path d="M3 9h18M3 15h18M9 3v18M15 3v18"/>
  </svg>
);

const IconPhone = ({ size = 11, color = "#94a3b8" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const IconRocket = ({ size = 14, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);

function StatCard({ label, value, sub, icon }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 14, padding: "24px 28px", flex: 1, minWidth: 160 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 30, fontWeight: 800, color: NAV, fontFamily: "Georgia, serif" }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "#475569", marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function Badge({ status, map }) {
  const color = map[status] || "#64748b";
  return (
    <span style={{ background: color + "18", color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "capitalize", border: `1px solid ${color}30` }}>
      {status}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
      <div style={{ width: 3, height: 20, background: ACCENT, borderRadius: 2 }} />
      <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: NAV, fontFamily: "Georgia, serif" }}>{children}</h2>
    </div>
  );
}

// ── Create Event Modal ────────────────────────────────────────────────────────
function CreateEventModal({ onClose, onCreated, committeeName, members }) {
  const defaultCategory = getDefaultCategory(committeeName);

  const [form, setForm] = useState({
    title: "", description: "", category: defaultCategory,
    date: "", time: "", venue: "", maxCapacity: 100, registrationDeadline: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggleMember = (id) => {
    setSelectedMembers(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.date || !form.time || !form.venue) {
      setError("Please fill all required fields."); return;
    }
    setLoading(true); setError("");
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append("image", image);
      if (selectedMembers.length > 0) fd.append("assignedMembers", JSON.stringify(selectedMembers));
      const res = await createEvent(fd);
      if (res.success) { onCreated(res.event); onClose(); }
      else setError(res.message || "Failed to create event.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    width: "100%", boxSizing: "border-box", padding: "10px 12px",
    border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13,
    color: "#0f172a", background: "#fff", outline: "none", fontFamily: "'Segoe UI', sans-serif",
  };
  const labelStyle = {
    display: "block", fontSize: 11, fontWeight: 700, color: "#475569",
    marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em",
  };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(13,27,42,0.65)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: "36px 40px", width: "100%", maxWidth: 600, maxHeight: "92vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: NAV, fontFamily: "Georgia, serif" }}>Create New Event</h2>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#64748b" }}>✕</button>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
            <IconAlertTriangle size={13} color="#ef4444" /> {error}
          </div>
        )}

        {/* Image */}
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Event Image</label>
          <div onClick={() => fileRef.current.click()} style={{ border: `2px dashed ${preview ? ACCENT : BORDER}`, borderRadius: 10, padding: preview ? 0 : "28px 20px", textAlign: "center", cursor: "pointer", overflow: "hidden", background: "#f8fafc" }}>
            {preview
              ? <img src={preview} alt="preview" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
              : <div><div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}><IconImage size={28} color="#94a3b8" /></div><div style={{ fontSize: 13, color: "#64748b", fontWeight: 600 }}>Click to upload event image</div><div style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>JPEG, PNG, WEBP — max 5MB</div></div>
            }
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: "none" }} />
          {preview && <button onClick={() => { setImage(null); setPreview(null); }} style={{ marginTop: 6, fontSize: 11, color: "#ef4444", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Remove image</button>}
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Event Title *</label>
          <input style={inputStyle} value={form.title} onChange={e => set("title", e.target.value)} placeholder="e.g. Annual Marathon 2026" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Description *</label>
          <textarea style={{ ...inputStyle, minHeight: 90, resize: "vertical" }} value={form.description} onChange={e => set("description", e.target.value)} placeholder="Brief description of the event..." />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Category *</label>
            <select style={inputStyle} value={form.category} onChange={e => set("category", e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Max Capacity</label>
            <input style={inputStyle} type="number" value={form.maxCapacity} onChange={e => set("maxCapacity", e.target.value)} min={1} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Date *</label>
            <input style={inputStyle} type="date" value={form.date} onChange={e => set("date", e.target.value)} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Time *</label>
            <input style={inputStyle} type="text" value={form.time} onChange={e => set("time", e.target.value)} placeholder="e.g. 10:00 AM – 1:00 PM" />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Venue *</label>
          <input style={inputStyle} value={form.venue} onChange={e => set("venue", e.target.value)} placeholder="e.g. Seminar Hall, DEC" />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={labelStyle}>Registration Deadline</label>
          <input style={inputStyle} type="date" value={form.registrationDeadline} onChange={e => set("registrationDeadline", e.target.value)} />
        </div>

        {/* Assign Members */}
        {members.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <label style={labelStyle}>Assign Members to this Event</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
              {members.map(m => {
                const selected = selectedMembers.includes(String(m._id));
                return (
                  <button key={m._id} onClick={() => toggleMember(String(m._id))} style={{
                    padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${selected ? ACCENT : BORDER}`,
                    background: selected ? ACCENT : "#f8fafc", color: selected ? "#fff" : "#475569",
                    fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.15s",
                  }}>
                    {selected ? "✓ " : ""}{m.name} <span style={{ opacity: 0.7, fontSize: 11 }}>· {m.role}</span>
                  </button>
                );
              })}
            </div>
            {selectedMembers.length > 0 && (
              <div style={{ marginTop: 6, fontSize: 11, color: ACCENT, fontWeight: 600 }}>
                {selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} assigned
              </div>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "12px 0", background: "#f1f5f9", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", color: "#475569" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: "12px 0", background: loading ? "#94a3b8" : NAV, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <IconRocket size={14} color="#fff" />
            {loading ? "Creating..." : "Create & Publish Event"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Add Member Modal ──────────────────────────────────────────────────────────
function AddMemberModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: "", role: "Member", department: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError("Name is required."); return; }
    setLoading(true); setError("");
    try {
      const token = localStorage.getItem("sem_token");
      const res = await fetch("http://localhost:5001/api/committee/members", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      }).then(r => r.json());
      if (res.success) { onAdded(res.members); onClose(); }
      else setError(res.message || "Failed to add member.");
    } catch { setError("Network error."); }
    finally { setLoading(false); }
  };

  const inputStyle = { width: "100%", boxSizing: "border-box", padding: "10px 12px", border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: "#0f172a", background: "#fff", outline: "none", fontFamily: "'Segoe UI', sans-serif" };
  const labelStyle = { display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.04em" };

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1100, background: "rgba(13,27,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: "32px 36px", width: "100%", maxWidth: 440, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: NAV, fontFamily: "Georgia, serif" }}>Add Member</h2>
          <button onClick={onClose} style={{ background: "#f1f5f9", border: "none", borderRadius: "50%", width: 30, height: 30, cursor: "pointer", fontSize: 15, color: "#64748b" }}>✕</button>
        </div>
        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#ef4444", fontWeight: 600, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <IconAlertTriangle size={13} color="#ef4444" /> {error}
          </div>
        )}
        <div style={{ marginBottom: 14 }}><label style={labelStyle}>Full Name *</label><input style={inputStyle} value={form.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Rahul Sharma" /></div>
        <div style={{ marginBottom: 14 }}><label style={labelStyle}>Role</label><input style={inputStyle} value={form.role} onChange={e => set("role", e.target.value)} placeholder="e.g. Vice President" /></div>
        <div style={{ marginBottom: 14 }}><label style={labelStyle}>Department</label><input style={inputStyle} value={form.department} onChange={e => set("department", e.target.value)} placeholder="e.g. Computer Science" /></div>
        <div style={{ marginBottom: 22 }}><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="98XXXXXXXX" /></div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "11px 0", background: "#f1f5f9", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#475569" }}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, padding: "11px 0", background: loading ? "#94a3b8" : NAV, border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: loading ? "not-allowed" : "pointer", color: "#fff" }}>
            {loading ? "Adding..." : "Add Member"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function CommitteeDashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [dashboard, setDashboard] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "committee") { navigate("/"); return; }
    loadAll();
  }, [isLoggedIn, user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dash, evts, regs] = await Promise.all([
        getCommitteeDashboard(),
        getCommitteeEvents(),
        getCommitteeRegistrations(),
      ]);
      if (dash.success) { setDashboard(dash); setMembers(dash.committee?.members || []); }
      if (evts.success) setEvents(evts.events || []);
      if (regs.success) setRegistrations(regs.registrations || []);
    } catch {}
    finally { setLoading(false); }
  };

  const removeMember = async (memberId) => {
    const token = localStorage.getItem("sem_token");
    const res = await fetch(`http://localhost:5001/api/committee/members/${memberId}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json());
    if (res.success) setMembers(res.members);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("sem_token");
    navigate("/");
  };

  if (!isLoggedIn || user?.role !== "committee") return null;

  const tabs = [
    { id: "overview",      label: "Overview",       Icon: () => <IconActivity size={14} color="currentColor" /> },
    { id: "events",        label: "Events",          Icon: () => <IconCalendar size={14} color="currentColor" /> },
    { id: "registrations", label: "Registrations",   Icon: () => <IconClipboard size={14} color="currentColor" /> },
    { id: "members",       label: "Members",         Icon: () => <IconUsers size={14} color="currentColor" /> },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Top Header Bar ── */}
      <div style={{ background: NAV, padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, borderBottom: `3px solid ${ACCENT}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#fff", fontFamily: "Georgia, serif" }}>
            Smart Event <span style={{ fontWeight: 400 }}>Management</span>
          </span>
          <span style={{ fontSize: 11, color: "#93c5fd", marginLeft: 8, fontWeight: 600, background: "rgba(147,197,253,0.15)", padding: "2px 10px", borderRadius: 20, border: "1px solid rgba(147,197,253,0.3)" }}>
            COMMITTEE PANEL
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{user?.name}</div>
            <div style={{ fontSize: 11, color: "#93c5fd" }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} style={{ padding: "7px 16px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, color: "#fca5a5", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* ── Committee Identity Bar ── */}
      <div style={{ background: "#132035", padding: "20px 40px 0", borderBottom: `1px solid rgba(255,255,255,0.08)` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>
            Your Committee
          </div>
          <h1 style={{ margin: "0 0 2px", fontSize: 26, fontWeight: 800, color: "#fff", fontFamily: "Georgia, serif" }}>
            {loading ? "Loading..." : (dashboard?.committee?.name || "Committee Dashboard")}
          </h1>
          <div style={{ fontSize: 13, color: "#93c5fd", marginBottom: 16 }}>
            {dashboard?.committee?.department || ""}
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: "10px 20px", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer",
                background: activeTab === t.id ? "#f5f6fa" : "transparent",
                color: activeTab === t.id ? NAV : "#93c5fd",
                fontWeight: 700, fontSize: 13, fontFamily: "'Segoe UI', sans-serif",
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 7,
              }}>
                <t.Icon />{t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#94a3b8", fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><IconLoader size={32} color="#94a3b8" /></div>
            Loading your dashboard...
          </div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div>
                <div style={{ display: "flex", gap: 20, marginBottom: 32, flexWrap: "wrap" }}>
                  <StatCard icon={<IconCalendar size={24} color={ACCENT} />} label="Total Events" value={dashboard?.stats?.totalEvents ?? 0} />
                  <StatCard icon={<IconActivity size={24} color="#16a34a" />} label="Active Events" value={dashboard?.stats?.upcomingEvents ?? 0} sub="ongoing + upcoming" />
                  <StatCard icon={<IconClipboard size={24} color="#d97706" />} label="Registrations" value={dashboard?.stats?.totalRegistrations ?? 0} />
                  <StatCard icon={<IconUsers size={24} color="#7c3aed" />} label="Members" value={dashboard?.stats?.totalMembers ?? 0} />
                </div>

                <SectionTitle>Recent Events</SectionTitle>
                {events.length === 0
                  ? (
                    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "48px 20px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><IconInbox size={36} color="#94a3b8" /></div>
                      <div style={{ fontWeight: 700, color: NAV, marginBottom: 6 }}>No events yet</div>
                      <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Create your first event and it will appear on the main website automatically.</div>
                      <button onClick={() => { setActiveTab("events"); setShowCreateEvent(true); }} style={{ padding: "10px 24px", background: NAV, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                        + Create First Event
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                      {events.slice(0, 3).map(e => (
                        <div key={e._id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                          {e.image && <img src={`http://localhost:5001${e.image}`} alt={e.title} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
                          <div style={{ padding: "16px 18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: NAV }}>{e.title}</h3>
                              <Badge status={e.status} map={statusColor} />
                            </div>
                            <div style={{ fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}><IconCalendar size={12} color="#64748b" /> {fmt(e.date)} &nbsp;·&nbsp; <IconClock size={12} color="#64748b" /> {e.time}</div>
                            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><IconMapPin size={12} color="#64748b" /> {e.venue}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                }
                {events.length > 0 && (
                  <button onClick={() => setActiveTab("events")} style={{ marginTop: 16, background: "none", border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#475569" }}>
                    View all events →
                  </button>
                )}
              </div>
            )}

            {/* ── EVENTS ── */}
            {activeTab === "events" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <SectionTitle>Your Events</SectionTitle>
                  <button onClick={() => setShowCreateEvent(true)} style={{ padding: "10px 22px", background: NAV, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    + Create Event
                  </button>
                </div>

                {events.length === 0 ? (
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><IconCalendar size={36} color="#94a3b8" /></div>
                    <div style={{ fontWeight: 700, color: NAV, marginBottom: 6 }}>No events created yet</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Create an event — it will automatically appear on the main website's Events page.</div>
                    <button onClick={() => setShowCreateEvent(true)} style={{ padding: "10px 24px", background: NAV, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Create Event</button>
                  </div>
                ) : (
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                          {["Title", "Category", "Date", "Time", "Venue", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((e, i) => (
                          <tr key={e._id} style={{ borderBottom: i < events.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                            <td style={{ padding: "14px 16px", fontWeight: 600, color: NAV }}>{e.title}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{e.category}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{fmt(e.date)}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{e.time}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{e.venue}</td>
                            <td style={{ padding: "14px 16px" }}><Badge status={e.status} map={statusColor} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── REGISTRATIONS ── */}
            {activeTab === "registrations" && (
              <div>
                <SectionTitle>Event Registrations</SectionTitle>
                {registrations.length === 0 ? (
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "48px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><IconClipboard size={36} color="#94a3b8" /></div>
                    <div style={{ color: "#94a3b8", fontSize: 14 }}>No registrations yet. They'll appear here once students register for your events.</div>
                  </div>
                ) : (
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                          {["Student", "Email", "Event", "Registered On", "Status"].map(h => (
                            <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.map((r, i) => (
                          <tr key={r._id} style={{ borderBottom: i < registrations.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                            <td style={{ padding: "14px 16px", fontWeight: 600, color: NAV }}>{r.user?.name || "—"}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{r.user?.email || "—"}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{r.eventTitle || "—"}</td>
                            <td style={{ padding: "14px 16px", color: "#475569" }}>{fmt(r.createdAt)}</td>
                            <td style={{ padding: "14px 16px" }}><Badge status={r.status} map={regStatusColor} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ── MEMBERS ── */}
            {activeTab === "members" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                  <SectionTitle>Committee Members</SectionTitle>
                  <button onClick={() => setShowAddMember(true)} style={{ padding: "10px 22px", background: NAV, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    + Add Member
                  </button>
                </div>

                {members.length === 0 ? (
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}><IconUsers size={36} color="#94a3b8" /></div>
                    <div style={{ fontWeight: 700, color: NAV, marginBottom: 6 }}>No members yet</div>
                    <div style={{ fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>Add your committee members — you can assign them to events when creating one.</div>
                    <button onClick={() => setShowAddMember(true)} style={{ padding: "10px 24px", background: NAV, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Add Member</button>
                  </div>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                    {members.map(m => (
                      <div key={m._id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "20px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                        <div>
                          <div style={{ width: 36, height: 36, borderRadius: "50%", background: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff", marginBottom: 10 }}>
                            {m.name.charAt(0).toUpperCase()}
                          </div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: NAV }}>{m.name}</div>
                          <div style={{ fontSize: 12, color: ACCENT, fontWeight: 600, marginTop: 2 }}>{m.role}</div>
                          {m.department && <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}><IconBuilding size={11} color="#94a3b8" /> {m.department}</div>}
                          {m.phone && <div style={{ fontSize: 11, color: "#94a3b8", display: "flex", alignItems: "center", gap: 4 }}><IconPhone size={11} color="#94a3b8" /> {m.phone}</div>}
                        </div>
                        <button onClick={() => removeMember(m._id)} style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: 6, padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {showCreateEvent && (
        <CreateEventModal
          onClose={() => setShowCreateEvent(false)}
          onCreated={(evt) => setEvents(prev => [evt, ...prev])}
          committeeName={dashboard?.committee?.name}
          members={members}
        />
      )}
      {showAddMember && (
        <AddMemberModal
          onClose={() => setShowAddMember(false)}
          onAdded={(mems) => setMembers(mems)}
        />
      )}
    </div>
  );
}