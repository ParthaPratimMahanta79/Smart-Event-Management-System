import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAdminDashboard, getAdminUsers, getAdminEvents,
  getAdminCommittees, deleteUser, deleteCommittee, toggleCommittee,
  getPendingPhotos, updatePhotoStatus, deleteAdminEvent,
  createCommittee, uploadAdminPhoto, getAdminGallery, deleteAdminPhoto,
} from "../services/api";

const NAV    = "#0d1b2a";
const ACCENT = "#2563eb";
const BORDER = "#e2e8f0";

const fmt = (iso) => iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const statusColor = { upcoming: "#1d6fa4", ongoing: "#16a34a", completed: "#64748b", cancelled: "#ef4444" };

// SVG Icons
const IconLogout    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconTrash     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconCamera    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconCalendar  = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconBuilding  = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M9 3v18"/><path d="M3 9h6"/><path d="M3 15h6"/></svg>;
const IconMapPin    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconUsers     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const IconClock     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const IconCheck     = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const IconX         = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconUpload    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
const IconWarning   = () => <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;

function StatCard({ label, value, accent }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 28px", flex: 1, minWidth: 140, borderTop: `3px solid ${accent || ACCENT}` }}>
      <div style={{ fontSize: 30, fontWeight: 800, color: NAV, fontFamily: "Georgia, serif" }}>{value ?? 0}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#64748b", marginTop: 4 }}>{label}</div>
    </div>
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

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div onClick={onCancel} style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(13,27,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, padding: "32px 36px", maxWidth: 380, width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.2)", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><IconWarning /></div>
        <div style={{ fontSize: 15, fontWeight: 700, color: NAV, marginBottom: 8 }}>Confirm Action</div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 24 }}>{message}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "11px 0", background: "#f1f5f9", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#475569" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "11px 0", background: "#ef4444", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#fff" }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab]     = useState("overview");
  const [stats, setStats]             = useState(null);
  const [users, setUsers]             = useState([]);
  const [events, setEvents]           = useState([]);
  const [committees, setCommittees]   = useState([]);
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [confirm, setConfirm]         = useState(null);

  // Create committee form
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", department: "", email: "", password: "" });
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  // Admin photo upload
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoMsg, setPhotoMsg] = useState(null);

  // ── NEW: admin upload modal state ────────────────────────────────────────
  const [showAdminUploadModal, setShowAdminUploadModal] = useState(false);
  const [adminPhotoDesc, setAdminPhotoDesc] = useState("");
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "admin") { navigate("/"); return; }
    loadAll();
  }, [isLoggedIn, user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [dash, u, e, c, pending, gallery] = await Promise.all([
        getAdminDashboard(), getAdminUsers(), getAdminEvents(),
        getAdminCommittees(), getPendingPhotos(), getAdminGallery(),
      ]);
      if (dash.success)    setStats(dash.stats);
      if (u.success)       setUsers(u.users);
      if (e.success)       setEvents(e.events);
      if (c.success)       setCommittees(c.committees);
      if (pending.success) setPendingPhotos(pending.photos);
      if (gallery.success) setGalleryPhotos(gallery.photos);
    } catch {}
    finally { setLoading(false); }
  };

  const ask = (message, action) => setConfirm({ message, action });
  const closeConfirm = () => setConfirm(null);

  const handleDeleteUser = (id) => ask("This will permanently delete the user account.", async () => {
    const res = await deleteUser(id);
    if (res.success) setUsers(u => u.filter(x => x._id !== id));
    closeConfirm();
  });

  const handleDeleteCommittee = (id, name) => ask(`This will permanently remove "${name}" committee and their login.`, async () => {
    const res = await deleteCommittee(id);
    if (res.success) setCommittees(c => c.filter(x => x._id !== id));
    closeConfirm();
  });

  const handleDeleteEvent = (id, title) => ask(`This will permanently delete the event "${title}" and remove it from the committee dashboard and main website.`, async () => {
    const res = await deleteAdminEvent(id);
    if (res.success) setEvents(e => e.filter(x => x._id !== id));
    closeConfirm();
  });

  const handleToggle = async (id) => {
    const res = await toggleCommittee(id);
    if (res.success) setCommittees(c => c.map(x => x._id === id ? { ...x, isActive: res.committee.isActive } : x));
  };

  const handlePhotoAction = async (id, status) => {
    const res = await updatePhotoStatus(id, status);
    if (res.success) {
      setPendingPhotos(p => p.filter(x => x._id !== id));
      if (status === "approved") {
        setGalleryPhotos(g => [res.photo, ...g]);
        setStats(s => s ? { ...s, pendingPhotos: (s.pendingPhotos || 1) - 1 } : s);
      }
    }
  };

  const handleDeleteGalleryPhoto = (id) => ask("This will permanently delete this photo from the gallery.", async () => {
    const res = await deleteAdminPhoto(id);
    if (res.success) setGalleryPhotos(g => g.filter(x => x._id !== id));
    closeConfirm();
  });

  const handleCreateCommittee = async () => {
    setCreateError("");
    if (!createForm.name || !createForm.department || !createForm.email || !createForm.password) {
      setCreateError("All fields are required."); return;
    }
    setCreating(true);
    const res = await createCommittee(createForm);
    setCreating(false);
    if (res.success) {
      setCommittees(c => [...c, res.committee]);
      setCreateForm({ name: "", department: "", email: "", password: "" });
      setShowCreateForm(false);
      loadAll();
    } else {
      setCreateError(res.message || "Failed to create committee.");
    }
  };

  // ── CHANGED: open modal instead of file picker directly ──────────────────
  const handleAdminUploadClick = () => {
    setAdminPhotoDesc("");
    setShowAdminUploadModal(true);
  };

  // ── NEW: called when admin confirms inside the modal ─────────────────────
  const handleAdminModalProceed = () => {
    if (!adminPhotoDesc.trim()) return;
    setShowAdminUploadModal(false);
    fileInputRef.current?.click();
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleAdminPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setUploadingPhoto(true); setPhotoMsg(null);
    const formData = new FormData();
    formData.append("image", file);
    // ── CHANGED: attach the description the admin typed ──────────────────
    formData.append("title", adminPhotoDesc.trim());
    // ─────────────────────────────────────────────────────────────────────
    const res = await uploadAdminPhoto(formData);
    setUploadingPhoto(false);
    if (res.success) {
      setGalleryPhotos(g => [res.photo, ...g]);
      setPhotoMsg({ type: "success", text: "Photo uploaded and published to gallery." });
    } else {
      setPhotoMsg({ type: "error", text: res.message || "Upload failed." });
    }
    setAdminPhotoDesc("");
    setTimeout(() => setPhotoMsg(null), 5000);
  };

  const handleLogout = () => { logout(); localStorage.removeItem("sem_token"); navigate("/"); };

  if (!isLoggedIn || user?.role !== "admin") return null;

  const tabs = [
    { id: "overview",   label: "Overview" },
    { id: "users",      label: "Users" },
    { id: "committees", label: "Committees" },
    { id: "events",     label: "Events" },
    { id: "gallery",    label: `Gallery${pendingPhotos.length > 0 ? ` (${pendingPhotos.length})` : ""}` },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ background: NAV, padding: "28px 40px 24px", borderBottom: `3px solid ${ACCENT}` }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#93c5fd", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Administration</div>
            <h1 style={{ margin: "0 0 4px", fontSize: 24, fontWeight: 800, color: "#fff", fontFamily: "Georgia, serif" }}>Admin Dashboard</h1>
            <div style={{ fontSize: 13, color: "#93c5fd" }}>Smart Event Management System</div>
          </div>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: 7, background: "#ef4444", border: "none", color: "#fff", borderRadius: 8, padding: "10px 22px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", marginTop: 4 }}
            onMouseEnter={e => e.currentTarget.style.background = "#dc2626"}
            onMouseLeave={e => e.currentTarget.style.background = "#ef4444"}>
            <IconLogout /> Sign Out
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${BORDER}`, padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, padding: "10px 0" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "10px 22px", border: "none", borderRadius: 8, cursor: "pointer",
              background: activeTab === t.id ? NAV : "transparent",
              color: activeTab === t.id ? "#fff" : "#64748b",
              fontWeight: 700, fontSize: 13, fontFamily: "'Segoe UI', sans-serif", transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 40px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#94a3b8" }}>Loading...</div>
        ) : (
          <>
            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && stats && (
              <div>
                <div style={{ display: "flex", gap: 20, marginBottom: 36, flexWrap: "wrap" }}>
                  <StatCard label="Registered Users"  value={stats.users}         accent="#2563eb" />
                  <StatCard label="Active Committees" value={stats.committees}    accent="#16a34a" />
                  <StatCard label="Total Events"      value={stats.events}        accent="#d97706" />
                  <StatCard label="Registrations"     value={stats.registrations} accent="#9333ea" />
                  <StatCard label="Pending Photos"    value={stats.pendingPhotos} accent="#ef4444" />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <SectionTitle>Recent Users</SectionTitle>
                    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                      {users.slice(0, 5).map((u, i) => (
                        <div key={u._id} style={{ padding: "14px 18px", borderBottom: i < 4 ? `1px solid ${BORDER}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: NAV }}>{u.name}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{u.email}</div>
                          </div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{fmt(u.createdAt)}</div>
                        </div>
                      ))}
                      {users.length === 0 && <div style={{ padding: "24px 18px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No users yet.</div>}
                    </div>
                  </div>
                  <div>
                    <SectionTitle>Committees</SectionTitle>
                    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                      {committees.slice(0, 5).map((c, i) => (
                        <div key={c._id} style={{ padding: "14px 18px", borderBottom: i < Math.min(4, committees.length - 1) ? `1px solid ${BORDER}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: NAV }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: "#94a3b8" }}>{c.department}</div>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.isActive ? "#dcfce7" : "#fef2f2", color: c.isActive ? "#15803d" : "#ef4444" }}>
                            {c.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                      ))}
                      {committees.length === 0 && <div style={{ padding: "24px 18px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No committees.</div>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── USERS ── */}
            {activeTab === "users" && (
              <div>
                <SectionTitle>All Users ({users.length})</SectionTitle>
                {users.length === 0
                  ? <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>No registered users yet.</div>
                  : (
                    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                            {["Name", "Email", "Phone", "Joined", "Action"].map(h => (
                              <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((u, i) => (
                            <tr key={u._id} style={{ borderBottom: i < users.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                              <td style={{ padding: "14px 16px", fontWeight: 600, color: NAV }}>{u.name}</td>
                              <td style={{ padding: "14px 16px", color: "#475569" }}>{u.email}</td>
                              <td style={{ padding: "14px 16px", color: "#475569" }}>{u.phone || "—"}</td>
                              <td style={{ padding: "14px 16px", color: "#475569" }}>{fmt(u.createdAt)}</td>
                              <td style={{ padding: "14px 16px" }}>
                                <button onClick={() => handleDeleteUser(u._id)} style={{ background: "#fef2f2", border: "none", color: "#ef4444", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}

            {/* ── COMMITTEES ── */}
            {activeTab === "committees" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <SectionTitle>All Committees ({committees.length})</SectionTitle>
                  <button onClick={() => setShowCreateForm(v => !v)} style={{ background: ACCENT, border: "none", color: "#fff", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                    {showCreateForm ? "✕ Cancel" : "+ Create Committee"}
                  </button>
                </div>

                {showCreateForm && (
                  <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 28px", marginBottom: 24 }}>
                    <div style={{ fontWeight: 800, color: NAV, fontSize: 15, marginBottom: 18 }}>Create New Committee</div>
                    {createError && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#ef4444", fontWeight: 600, marginBottom: 14 }}>⚠ {createError}</div>}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px 20px" }}>
                      {[
                        { label: "Committee Name", key: "name", placeholder: "e.g. Drama Committee" },
                        { label: "Department", key: "department", placeholder: "e.g. Fine Arts" },
                        { label: "Login Email", key: "email", placeholder: "committee@smartevent.com" },
                        { label: "Login Password", key: "password", placeholder: "Min 6 characters", type: "password" },
                      ].map(f => (
                        <div key={f.key}>
                          <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>{f.label}</label>
                          <input
                            type={f.type || "text"}
                            value={createForm[f.key]}
                            onChange={e => setCreateForm(c => ({ ...c, [f.key]: e.target.value }))}
                            placeholder={f.placeholder}
                            style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", border: `1.5px solid ${BORDER}`, borderRadius: 8, fontSize: 13, outline: "none", fontFamily: "'Segoe UI', sans-serif" }}
                          />
                        </div>
                      ))}
                    </div>
                    <button onClick={handleCreateCommittee} disabled={creating} style={{ marginTop: 18, background: creating ? "#94a3b8" : NAV, border: "none", color: "#fff", borderRadius: 8, padding: "11px 28px", fontWeight: 700, fontSize: 13, cursor: creating ? "not-allowed" : "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                      {creating ? "Creating..." : "Create Committee →"}
                    </button>
                  </div>
                )}

                {committees.length === 0 && !showCreateForm
                  ? <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>No committees found.</div>
                  : (
                    <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: "#f8fafc", borderBottom: `1px solid ${BORDER}` }}>
                            {["Name", "Department", "Email", "Status", "Actions"].map(h => (
                              <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {committees.map((c, i) => (
                            <tr key={c._id} style={{ borderBottom: i < committees.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                              <td style={{ padding: "14px 16px", fontWeight: 600, color: NAV }}>{c.name}</td>
                              <td style={{ padding: "14px 16px", color: "#475569" }}>{c.department}</td>
                              <td style={{ padding: "14px 16px", color: "#475569" }}>{c.email}</td>
                              <td style={{ padding: "14px 16px" }}>
                                <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: c.isActive ? "#dcfce7" : "#fef2f2", color: c.isActive ? "#15803d" : "#ef4444" }}>
                                  {c.isActive ? "Active" : "Inactive"}
                                </span>
                              </td>
                              <td style={{ padding: "14px 16px", display: "flex", gap: 8 }}>
                                <button onClick={() => handleToggle(c._id)} style={{ background: "#f0f4ff", border: "none", color: ACCENT, borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                  {c.isActive ? "Deactivate" : "Activate"}
                                </button>
                                <button onClick={() => handleDeleteCommittee(c._id, c.name)} style={{ background: "#fef2f2", border: "none", color: "#ef4444", borderRadius: 6, padding: "5px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
              </div>
            )}

            {/* ── EVENTS ── */}
            {activeTab === "events" && (
              <div>
                <SectionTitle>All Events ({events.length})</SectionTitle>
                {events.length === 0
                  ? <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "48px 20px", textAlign: "center", color: "#94a3b8" }}>No events yet. Committee admins create events from their dashboard.</div>
                  : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {events.map(e => {
                        const accent = statusColor[e.status] || "#64748b";
                        return (
                          <div key={e._id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden", display: "flex" }}>
                            <div style={{ width: 180, minHeight: 150, flexShrink: 0, background: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {e.image
                                ? <img src={`http://localhost:5001${e.image}`} alt={e.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                : <IconCalendar />}
                            </div>
                            <div style={{ padding: "18px 24px", flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                                <div>
                                  <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: NAV, fontFamily: "Georgia, serif" }}>{e.title}</h3>
                                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ background: "#f0f4ff", color: ACCENT, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20 }}>{e.category}</span>
                                    <span style={{ background: accent + "18", color: accent, fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 20, textTransform: "capitalize", border: `1px solid ${accent}30` }}>{e.status}</span>
                                  </div>
                                </div>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                                  <div style={{ textAlign: "right" }}>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: NAV }}>{fmt(e.date)}</div>
                                    <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{e.time}</div>
                                  </div>
                                  <button onClick={() => handleDeleteEvent(e._id, e.title)} style={{ display: "flex", alignItems: "center", gap: 5, background: "#fef2f2", border: "none", color: "#ef4444", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                    <IconTrash /> Delete
                                  </button>
                                </div>
                              </div>
                              <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{e.description}</p>
                              <div style={{ display: "flex", gap: 20, fontSize: 12, color: "#475569", flexWrap: "wrap" }}>
                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconBuilding /> <strong>Committee:</strong> {e.organizer?.name || "—"}</span>
                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconMapPin /> <strong>Venue:</strong> {e.venue}</span>
                                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconUsers /> <strong>Capacity:</strong> {e.maxCapacity}</span>
                                {e.registrationDeadline && <span style={{ display: "flex", alignItems: "center", gap: 4 }}><IconClock /> <strong>Deadline:</strong> {fmt(e.registrationDeadline)}</span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
              </div>
            )}

            {/* ── GALLERY ── */}
            {activeTab === "gallery" && (
              <div>
                {/* Pending approvals */}
                <div style={{ marginBottom: 40 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <SectionTitle>Pending Photo Approvals ({pendingPhotos.length})</SectionTitle>
                  </div>
                  {pendingPhotos.length === 0
                    ? <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "32px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No photos pending approval.</div>
                    : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                        {pendingPhotos.map(p => (
                          <div key={p._id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                            <div style={{ height: 180, overflow: "hidden", background: "#f1f5f9" }}>
                              <img src={`http://localhost:5001${p.image}`} alt="pending" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ padding: "14px 16px" }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: NAV, marginBottom: 4 }}>{p.title || "Untitled"}</div>
                              <div style={{ fontSize: 11, color: "#94a3b8", marginBottom: 14 }}>
                                By: {p.uploadedBy?.name || "Unknown"} · {p.uploadedBy?.email || ""}
                                <br />Uploaded: {fmt(p.createdAt)}
                              </div>
                              <div style={{ display: "flex", gap: 8 }}>
                                <button onClick={() => handlePhotoAction(p._id, "approved")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, flex: 1, padding: "8px 0", background: "#dcfce7", border: "none", color: "#15803d", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                  <IconCheck /> Approve
                                </button>
                                <button onClick={() => handlePhotoAction(p._id, "rejected")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, flex: 1, padding: "8px 0", background: "#fef2f2", border: "none", color: "#ef4444", borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                                  <IconX /> Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                {/* Admin upload + approved gallery */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                    <SectionTitle>Gallery Photos ({galleryPhotos.length})</SectionTitle>
                    <div>
                      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleAdminPhotoUpload} />
                      <button onClick={handleAdminUploadClick} disabled={uploadingPhoto} style={{ display: "flex", alignItems: "center", gap: 7, background: ACCENT, border: "none", color: "#fff", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: uploadingPhoto ? "not-allowed" : "pointer", fontFamily: "'Segoe UI', sans-serif" }}>
                        <IconCamera /> {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                      </button>
                    </div>
                  </div>

                  {photoMsg && (
                    <div style={{ background: photoMsg.type === "success" ? "#dcfce7" : "#fef2f2", border: `1px solid ${photoMsg.type === "success" ? "#bbf7d0" : "#fecaca"}`, borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, color: photoMsg.type === "success" ? "#15803d" : "#ef4444", marginBottom: 16 }}>
                      {photoMsg.text}
                    </div>
                  )}

                  {galleryPhotos.length === 0
                    ? <div style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 10, padding: "32px 20px", textAlign: "center", color: "#94a3b8", fontSize: 13 }}>No approved photos yet.</div>
                    : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
                        {galleryPhotos.map(p => (
                          <div key={p._id} style={{ background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" }}>
                            <div style={{ height: 160, overflow: "hidden", background: "#f1f5f9" }}>
                              <img src={`http://localhost:5001${p.image}`} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: 12, color: NAV }}>{p.title || "Photo"}</div>
                                <div style={{ fontSize: 11, color: "#94a3b8" }}>By: {p.uploadedBy?.name || "Admin"}</div>
                              </div>
                              <button onClick={() => handleDeleteGalleryPhoto(p._id)} style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#fef2f2", border: "none", color: "#ef4444", borderRadius: 6, padding: "6px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                                <IconTrash />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {confirm && <ConfirmModal message={confirm.message} onConfirm={confirm.action} onCancel={closeConfirm} />}

      {/* ── Admin upload modal ─────────────────────────────────────────────── */}
      {showAdminUploadModal && (
        <div
          onClick={() => setShowAdminUploadModal(false)}
          style={{ position: "fixed", inset: 0, zIndex: 1300, background: "rgba(13,27,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: 12, padding: "28px 26px 24px", width: "100%", maxWidth: 420, boxShadow: "0 16px 48px rgba(0,0,0,0.2)", fontFamily: "'Segoe UI', sans-serif" }}
          >
            <div style={{ fontSize: 15, fontWeight: 800, color: NAV, marginBottom: 4 }}>Upload a Photo</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 18 }}>Add a title/description before selecting the image.</div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
              Description <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              autoFocus
              placeholder="e.g. Teachers Day celebration 2025…"
              value={adminPhotoDesc}
              onChange={e => setAdminPhotoDesc(e.target.value)}
              style={{ width: "100%", boxSizing: "border-box", resize: "vertical", border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "9px 12px", fontSize: 13, fontFamily: "'Segoe UI', sans-serif", color: NAV, background: "#fff", WebkitTextFillColor: NAV, minHeight: 80, outline: "none" }}
              onFocus={e => e.target.style.borderColor = ACCENT}
              onBlur={e => e.target.style.borderColor = BORDER}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAdminUploadModal(false)}
                style={{ background: "#f1f5f9", border: "none", color: "#475569", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif" }}
              >Cancel</button>
              <button
                onClick={handleAdminModalProceed}
                disabled={!adminPhotoDesc.trim()}
                style={{ display: "flex", alignItems: "center", gap: 6, background: adminPhotoDesc.trim() ? ACCENT : "#93c5fd", border: "none", color: "#fff", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 13, cursor: adminPhotoDesc.trim() ? "pointer" : "not-allowed", fontFamily: "'Segoe UI', sans-serif" }}
              >
                <IconUpload /> Choose Photo
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────────── */}

    </div>
  );
}