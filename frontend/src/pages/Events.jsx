import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { openLoginModal } from "../components/Navbar";
import { COMMITTEES, ALL_COMMITTEES, ONGOING_EVENTS, UPCOMING_EVENTS, PAST_EVENTS } from "../data/eventsData";
import { Search, X, MapPin, Clock, Calendar, ChevronDown, ChevronUp, School, CheckCircle, Circle } from "lucide-react";

const CATEGORIES = ["All", "Science", "Technology", "Art", "Music", "Sports", "Business","Other"];
const CAT_COLOR = { Science: "#e85d26", Technology: "#1d6fa4", Art: "#9333ea", Music: "#ea580c", Sports: "#dc2626", Business: "#15803d" };
const INITIAL_SHOW = 3;

const getUserKey = (userId) => `sem_registered_${userId}`;
const getRegisteredIds = (userId) => {
  if (!userId) return [];
  try { return JSON.parse(localStorage.getItem(getUserKey(userId)) || "[]"); }
  catch { return []; }
};

const computeStatus = (dateStr) => {
  const now = new Date();
  const date = new Date(dateStr);
  const dayStart = new Date(date); dayStart.setHours(0, 0, 0, 0);
  const dayEnd   = new Date(date); dayEnd.setHours(23, 59, 59, 999);
  if (now < dayStart) return "upcoming";
  if (now >= dayStart && now <= dayEnd) return "ongoing";
  return "completed";
};

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

const tagStatic = (list, status) => list.map(e => ({ ...e, _status: status, _fromDb: false }));

function CommitteeDropdown({ activeCommittee, onChange, allCommittees, committeeMap }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: "flex", alignItems: "center", gap: 8, padding: "7px 14px",
        background: activeCommittee !== "All Committees" ? "#1a3557" : "#f1f5f9",
        color: activeCommittee !== "All Committees" ? "#fff" : "#475569",
        border: "1.5px solid " + (activeCommittee !== "All Committees" ? "#1a3557" : "#e2e8f0"),
        borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
        fontFamily: "'Segoe UI', sans-serif", transition: "all 0.15s", whiteSpace: "nowrap",
      }}>
        <span>{activeCommittee !== "All Committees" && committeeMap[activeCommittee] ? committeeMap[activeCommittee].icon : <School size={14} />}</span>
        {activeCommittee}
        <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>{open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</span>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10, boxShadow: "0 8px 28px rgba(0,0,0,0.12)", zIndex: 1000, minWidth: 210, overflow: "hidden" }}>
          {allCommittees.map(c => {
            const info = committeeMap[c];
            const isActive = activeCommittee === c;
            return (
              <button key={c} onClick={() => { onChange(c); setOpen(false); }} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px",
                background: isActive ? "#f0f4ff" : "transparent", border: "none",
                borderLeft: isActive ? "3px solid #1a3557" : "3px solid transparent",
                textAlign: "left", cursor: "pointer", fontSize: 13,
                fontWeight: isActive ? 700 : 500, color: isActive ? "#1a3557" : "#374151",
                fontFamily: "'Segoe UI', sans-serif",
              }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                <span style={{ fontSize: 15 }}>{info ? info.icon : <School size={15} />}</span>{c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SeeMoreButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ textAlign: "center", marginTop: 36 }}>
      <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
        padding: "11px 40px", background: hov ? "#1a3557" : "transparent",
        color: hov ? "#fff" : "#1a3557", border: "2px solid #1a3557", borderRadius: 8,
        fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Segoe UI', sans-serif", transition: "all 0.2s",
      }}>See More →</button>
    </div>
  );
}

function SectionHeading({ label, color, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <div style={{ width: 4, height: 28, background: color, borderRadius: 4 }} />
      <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#0f172a", fontFamily: "'Georgia', serif", letterSpacing: "-0.3px" }}>{label}</h2>
      <span style={{ background: color + "20", color, fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{count} Events</span>
    </div>
  );
}

function EventCard({ event, past, registeredIds, committeeMap, isOngoing }) {
  const [hov, setHov] = useState(false);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const accent = CAT_COLOR[event.category] || "#e85d26";
  const committee = event.committee || "Unknown Committee";
  const committeeInfo = committeeMap[committee] || { icon: null, color: "#64748b" };
  const alreadyRegistered = registeredIds.includes(String(event.id));

  const handleRegisterClick = (e) => {
    e.stopPropagation();
    if (past) return;
    if (!isLoggedIn) { openLoginModal(`/Eventregister/${event.id}`); return; }
    if (alreadyRegistered) return;
    navigate(`/Eventregister/${event.id}`);
  };

  const getButtonLabel = () => {
    if (past) return "Event Ended";
    if (!isLoggedIn) return "Login to Register";
    if (alreadyRegistered) return "Registered";
    return "Register Now →";
  };

  const getButtonStyle = () => {
    const base = {
      width: "100%", padding: "10px 0", border: "none",
      borderRadius: 7, fontWeight: 700, fontSize: 13, transition: "all 0.2s",
      fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.02em", flexShrink: 0,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
    };
    if (past)              return { ...base, background: "#f1f5f9", color: "#94a3b8", cursor: "default", pointerEvents: "none" };
    if (alreadyRegistered) return { ...base, background: "#dcfce7", color: "#15803d", cursor: "default", pointerEvents: "none" };
    if (!isLoggedIn)       return { ...base, background: hov ? "#2563eb" : "#f1f5f9", color: hov ? "#fff" : "#475569", cursor: "pointer" };
    return { ...base, background: hov ? accent : "#f1f5f9", color: hov ? "#fff" : "#475569", cursor: "pointer" };
  };

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      background: "#fff", borderRadius: 10, overflow: "hidden",
      boxShadow: hov ? "0 10px 36px rgba(0,0,0,0.13)" : "0 2px 10px rgba(0,0,0,0.07)",
      transform: hov && !past ? "translateY(-4px)" : "none", transition: "all 0.25s ease",
      border: "1px solid #e5e7eb", opacity: past ? 0.85 : 1,
      display: "flex", flexDirection: "column",
    }}>
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden", background: "#f1f5f9", flexShrink: 0 }}>
        {event.image
          ? <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover", transform: hov && !past ? "scale(1.05)" : "scale(1)", transition: "transform 0.4s ease", filter: past ? "grayscale(30%)" : "none" }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><Calendar size={48} color="#cbd5e1" /></div>
        }
        {past && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />}
        <div style={{ position: "absolute", bottom: 0, right: 0, background: past ? "#64748b" : accent, color: "#fff", padding: "8px 14px", textAlign: "center", minWidth: 52 }}>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{event.day}</div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{event.month}</div>
        </div>
        {past && <div style={{ position: "absolute", top: 10, left: 10, background: "#475569", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>Ended</div>}
        {!past && <div style={{ position: "absolute", top: 10, right: 10, background: accent + "ee", color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>{event.category}</div>}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Committee badge */}
        <div style={{ marginBottom: 10 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: committeeInfo.color + "12",
            border: `1.5px solid ${committeeInfo.color}30`,
            borderRadius: 20, padding: "4px 12px", fontSize: 11, fontWeight: 700,
            color: committeeInfo.color, maxWidth: "100%", overflow: "hidden",
          }}>
            <span style={{ fontSize: 13, flexShrink: 0 }}>{committeeInfo.icon || <School size={13} />}</span>
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              By &nbsp;<span style={{ fontWeight: 800 }}>{committee}</span>
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700, color: "#0f172a", lineHeight: 1.35, fontFamily: "'Georgia', serif" }}>{event.title}</h3>

        {/* Description */}
        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b", lineHeight: 1.6, flex: 1 }}>{event.description}</p>

        {/* Time & Location */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {event.time}</span>
          <span style={{ color: past ? "#64748b" : accent, fontWeight: 600, fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}><MapPin size={12} /> {event.location}</span>
        </div>

        {/* Button or Ongoing badge */}
        {isOngoing ? (
          <div style={{
            width: "100%", padding: "10px 0", background: "#dcfce7",
            color: "#15803d", border: "none", borderRadius: 7,
            fontWeight: 700, fontSize: 13, fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: "0.02em", textAlign: "center", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <Circle size={10} fill="#15803d" color="#15803d" /> Ongoing
          </div>
        ) : (
          <button onClick={handleRegisterClick} style={getButtonStyle()}>
            {alreadyRegistered && <CheckCircle size={14} />}
            {getButtonLabel()}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Events() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeCommittee, setActiveCommittee] = useState("All Committees");
  const [search, setSearch] = useState("");
  const [showOngoing, setShowOngoing]   = useState(INITIAL_SHOW);
  const [showUpcoming, setShowUpcoming] = useState(INITIAL_SHOW);
  const [showPast, setShowPast]         = useState(INITIAL_SHOW);
  const [registeredIds, setRegisteredIds] = useState(() => getRegisteredIds(user?.id));
  const [dbEvents, setDbEvents] = useState([]);
  const [committeeMap, setCommitteeMap] = useState({ ...COMMITTEES });
  const [allCommittees, setAllCommittees] = useState(ALL_COMMITTEES);

  useEffect(() => {
    fetch("http://localhost:5001/api/committee/list")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.committees?.length) {
          const merged = { ...COMMITTEES };
          data.committees.forEach(c => {
            if (!merged[c.name]) merged[c.name] = { icon: null, color: "#64748b" };
          });
          setCommitteeMap(merged);
          setAllCommittees(["All Committees", ...Object.keys(merged)]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("http://localhost:5001/api/events")
      .then(r => r.json())
      .then(data => {
        if (data.success && data.events?.length) {
          setDbEvents(data.events.map(normalizeDbEvent).filter(e => e.title));
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { setRegisteredIds(getRegisteredIds(user?.id)); }, [user?.id]);
  useEffect(() => {
    const h = () => setRegisteredIds(getRegisteredIds(user?.id));
    window.addEventListener("focus", h);
    return () => window.removeEventListener("focus", h);
  }, [user?.id]);

  const staticAll = [
    ...tagStatic(ONGOING_EVENTS,  "ongoing"),
    ...tagStatic(UPCOMING_EVENTS, "upcoming"),
    ...tagStatic(PAST_EVENTS,     "completed"),
  ];

  const staticTitles = new Set(staticAll.map(e => e.title.toLowerCase().trim()));
  const uniqueDbEvents = dbEvents.filter(e => !staticTitles.has(e.title.toLowerCase().trim()));
  const allEvents = [...staticAll, ...uniqueDbEvents];

  const filterList = (list) => list.filter(e => {
    const matchCat    = activeCategory === "All" || e.category === activeCategory;
    const matchComm   = activeCommittee === "All Committees" || e.committee === activeCommittee;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchComm && matchSearch;
  });

  const ongoing  = filterList(allEvents.filter(e => e._status === "ongoing"));
  const upcoming = filterList(allEvents.filter(e => e._status === "upcoming"));
  const past     = filterList(allEvents.filter(e => e._status === "completed"));

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>
      <div style={{ position: "fixed", top: 64, left: 0, right: 0, zIndex: 998, background: "#fff", borderBottom: "1px solid #e5e7eb", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: "6px 18px", borderRadius: 6, border: "none",
              background: activeCategory === cat ? "#e85d26" : "#f1f5f9",
              color: activeCategory === cat ? "#fff" : "#475569",
              fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.15s", fontFamily: "'Segoe UI', sans-serif",
            }}>{cat}</button>
          ))}
          <div style={{ width: 1, height: 24, background: "#e2e8f0", margin: "0 4px" }} />
          <CommitteeDropdown
            activeCommittee={activeCommittee}
            onChange={setActiveCommittee}
            allCommittees={allCommittees}
            committeeMap={committeeMap}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "0 12px", gap: 8 }}>
          <Search size={14} color="#94a3b8" />
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: "none", outline: "none", fontSize: 13, padding: "8px 0", background: "transparent", color: "#0f172a", width: 200, fontFamily: "'Segoe UI', sans-serif" }} />
          {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center" }}><X size={14} /></button>}
        </div>
      </div>

      <div style={{ padding: "116px 40px 60px", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>

        {activeCommittee !== "All Committees" && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", border: `1.5px solid ${(committeeMap[activeCommittee]?.color || "#1a3557")}30`, borderLeft: `4px solid ${committeeMap[activeCommittee]?.color || "#1a3557"}`, borderRadius: 10, padding: "12px 20px", marginBottom: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <span style={{ fontSize: 22 }}>{committeeMap[activeCommittee]?.icon || <School size={22} />}</span>
            <div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>Showing events by: {activeCommittee}</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{ongoing.length + upcoming.length + past.length} event(s) found</div>
            </div>
            <button onClick={() => setActiveCommittee("All Committees")} style={{ marginLeft: "auto", background: "none", border: "1px solid #e2e8f0", borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#64748b", cursor: "pointer", fontWeight: 600 }}>✕ Clear</button>
          </div>
        )}

        {ongoing.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <SectionHeading label="Ongoing Events" color="#16a34a" count={ongoing.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, alignItems: "stretch" }}>
              {ongoing.slice(0, showOngoing).map(e => <EventCard key={e.id} event={e} isOngoing registeredIds={registeredIds} committeeMap={committeeMap} />)}
            </div>
            {ongoing.length > showOngoing && <SeeMoreButton onClick={() => setShowOngoing(v => v + 3)} />}
          </div>
        )}

        {upcoming.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <SectionHeading label="Upcoming Events" color="#1d6fa4" count={upcoming.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, alignItems: "stretch" }}>
              {upcoming.slice(0, showUpcoming).map(e => <EventCard key={e.id} event={e} registeredIds={registeredIds} committeeMap={committeeMap} />)}
            </div>
            {upcoming.length > showUpcoming && <SeeMoreButton onClick={() => setShowUpcoming(v => v + 3)} />}
          </div>
        )}

        {past.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionHeading label="Past Events" color="#64748b" count={past.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28, alignItems: "stretch" }}>
              {past.slice(0, showPast).map(e => <EventCard key={e.id} event={e} past registeredIds={registeredIds} committeeMap={committeeMap} />)}
            </div>
            {past.length > showPast && <SeeMoreButton onClick={() => setShowPast(v => v + 3)} />}
          </div>
        )}

        {ongoing.length === 0 && upcoming.length === 0 && past.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb" }}>
            <div style={{ marginBottom: 12 }}><Calendar size={40} color="#cbd5e1" /></div>
            <h3 style={{ color: "#0f172a", marginBottom: 6 }}>No events found</h3>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Try a different filter or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}