import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { COMMITTEES, ALL_COMMITTEES, ONGOING_EVENTS, UPCOMING_EVENTS, PAST_EVENTS } from "../data/eventsData";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ["All", "Science", "Technology", "Art", "Music", "Sports", "Business"];

const CAT_COLOR = {
  Science:    "#e85d26",
  Technology: "#1d6fa4",
  Art:        "#9333ea",
  Music:      "#ea580c",
  Sports:     "#dc2626",
  Business:   "#15803d",
};

const INITIAL_SHOW = 3;

// ─── Committee Dropdown ───────────────────────────────────────────────────────
function CommitteeDropdown({ activeCommittee, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 14px",
          background: activeCommittee !== "All Committees" ? "#1a3557" : "#f1f5f9",
          color: activeCommittee !== "All Committees" ? "#fff" : "#475569",
          border: "1.5px solid " + (activeCommittee !== "All Committees" ? "#1a3557" : "#e2e8f0"),
          borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer",
          fontFamily: "'Segoe UI', sans-serif", transition: "all 0.15s", whiteSpace: "nowrap",
        }}
      >
        <span>{activeCommittee !== "All Committees" && COMMITTEES[activeCommittee] ? COMMITTEES[activeCommittee].icon : "🏫"}</span>
        {activeCommittee}
        <span style={{ fontSize: 10, opacity: 0.7, marginLeft: 2 }}>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", right: 0,
          background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
          boxShadow: "0 8px 28px rgba(0,0,0,0.12)", zIndex: 1000, minWidth: 210, overflow: "hidden",
        }}>
          {ALL_COMMITTEES.map(c => {
            const info = COMMITTEES[c];
            const isActive = activeCommittee === c;
            return (
              <button
                key={c}
                onClick={() => { onChange(c); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  width: "100%", padding: "10px 16px",
                  background: isActive ? "#f0f4ff" : "transparent",
                  border: "none", borderLeft: isActive ? "3px solid #1a3557" : "3px solid transparent",
                  textAlign: "left", cursor: "pointer",
                  fontSize: 13, fontWeight: isActive ? 700 : 500,
                  color: isActive ? "#1a3557" : "#374151",
                  fontFamily: "'Segoe UI', sans-serif",
                }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#f8fafc"; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 15 }}>{info ? info.icon : ""}</span>
                {c}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── See More Button ──────────────────────────────────────────────────────────
function SeeMoreButton({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ textAlign: "center", marginTop: 36 }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          padding: "11px 40px",
          background: hov ? "#1a3557" : "transparent",
          color: hov ? "#fff" : "#1a3557",
          border: "2px solid #1a3557", borderRadius: 8,
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          fontFamily: "'Segoe UI', sans-serif", letterSpacing: "0.03em", transition: "all 0.2s",
        }}
      >
        See More →
      </button>
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────
function SectionHeading({ label, color, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <div style={{ width: 4, height: 28, background: color, borderRadius: 4 }} />
      <h2 style={{
        margin: 0, fontSize: 22, fontWeight: 800,
        color: "#0f172a", fontFamily: "'Georgia', serif", letterSpacing: "-0.3px",
      }}>
        {label}
      </h2>
      <span style={{
        background: color + "20", color,
        fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
      }}>
        {count} Events
      </span>
    </div>
  );
}

// ─── Event Card ───────────────────────────────────────────────────────────────
function EventCard({ event, past }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  const accent = CAT_COLOR[event.category] || "#e85d26";
  const committee = event.committee || "Sports Committee";
  const committeeInfo = COMMITTEES[committee] || { icon: "", color: "#64748b" };

  const goToRegister = () => {
    if (!past) navigate(`/Eventregister/${event.id}`);
  };

  return (
    <div
      onClick={goToRegister}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff", borderRadius: 10, overflow: "hidden",
        boxShadow: hov ? "0 10px 36px rgba(0,0,0,0.13)" : "0 2px 10px rgba(0,0,0,0.07)",
        transform: hov && !past ? "translateY(-4px)" : "none",
        transition: "all 0.25s ease",
        border: "1px solid #e5e7eb",
        cursor: past ? "default" : "pointer",
        opacity: past ? 0.85 : 1,
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hov && !past ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.4s ease",
            filter: past ? "grayscale(30%)" : "none",
          }}
        />
        {past && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />}

        {/* Date badge */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          background: past ? "#64748b" : accent,
          color: "#fff", padding: "8px 14px", textAlign: "center", minWidth: 52,
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{event.day}</div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{event.month}</div>
        </div>

        {past && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "#475569", color: "#fff",
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Ended
          </div>
        )}

        {!past && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: accent + "ee", color: "#fff",
            fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            {event.category}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: "16px 20px 20px" }}>
        <div style={{ marginBottom: 10 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: committeeInfo.color + "12",
            border: `1.5px solid ${committeeInfo.color}30`,
            borderRadius: 20, padding: "4px 12px",
            fontSize: 11, fontWeight: 700, color: committeeInfo.color,
          }}>
            <span style={{ fontSize: 13 }}>{committeeInfo.icon}</span>
            By &nbsp;<span style={{ fontWeight: 800 }}>{committee}</span>
          </div>
        </div>

        <h3 style={{
          margin: "0 0 8px", fontSize: 16, fontWeight: 700,
          color: "#0f172a", lineHeight: 1.35, fontFamily: "'Georgia', serif",
        }}>
          {event.title}
        </h3>

        <p style={{ margin: "0 0 14px", fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>
          {event.description}
        </p>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 12, color: "#94a3b8", flexWrap: "wrap", gap: 6,
        }}>
          <span> {event.time}</span>
          <span style={{ color: past ? "#64748b" : accent, fontWeight: 600, fontSize: 12 }}>
             {event.location}
          </span>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); goToRegister(); }}
          disabled={!!past}
          style={{
            marginTop: 16, width: "100%", padding: "10px 0",
            background: past ? "#f1f5f9" : (hov ? accent : "#f1f5f9"),
            color: past ? "#94a3b8" : (hov ? "#fff" : "#475569"),
            border: "none", borderRadius: 7,
            fontWeight: 700, fontSize: 13,
            cursor: past ? "default" : "pointer",
            transition: "all 0.2s",
            fontFamily: "'Segoe UI', sans-serif",
            letterSpacing: "0.02em",
            pointerEvents: past ? "none" : "auto",
          }}
        >
          {past ? "Event Ended" : "Register Now →"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Events() {
  const [activeCategory, setActiveCategory]   = useState("All");
  const [activeCommittee, setActiveCommittee] = useState("All Committees");
  const [search, setSearch]                   = useState("");
  const [showOngoing, setShowOngoing]         = useState(INITIAL_SHOW);
  const [showUpcoming, setShowUpcoming]       = useState(INITIAL_SHOW);
  const [showPast, setShowPast]               = useState(INITIAL_SHOW);

  const filterList = (list) => list.filter(e => {
    const matchCat    = activeCategory === "All" || e.category === activeCategory;
    const matchComm   = activeCommittee === "All Committees" || e.committee === activeCommittee;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchComm && matchSearch;
  });

  const ongoing  = filterList(ONGOING_EVENTS);
  const upcoming = filterList(UPCOMING_EVENTS);
  const past     = filterList(PAST_EVENTS);

  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Filter bar ── */}
      <div style={{
        position: "fixed", top: 64, left: 0, right: 0, zIndex: 998,
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "12px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: "6px 18px", borderRadius: 6, border: "none",
              background: activeCategory === cat ? "#e85d26" : "#f1f5f9",
              color: activeCategory === cat ? "#fff" : "#475569",
              fontWeight: 600, fontSize: 13, cursor: "pointer",
              transition: "all 0.15s", fontFamily: "'Segoe UI', sans-serif",
            }}>
              {cat}
            </button>
          ))}
          <div style={{ width: 1, height: 24, background: "#e2e8f0", margin: "0 4px" }} />
          <CommitteeDropdown activeCommittee={activeCommittee} onChange={setActiveCommittee} />
        </div>

        <div style={{
          display: "flex", alignItems: "center",
          background: "#f8fafc", border: "1.5px solid #e2e8f0",
          borderRadius: 8, padding: "0 12px", gap: 8,
        }}>
          <span style={{ color: "#94a3b8", fontSize: 14 }}>🔍</span>
          <input
            type="text" placeholder="Search events..."
            value={search} onChange={e => setSearch(e.target.value)}
            style={{
              border: "none", outline: "none", fontSize: 13, padding: "8px 0",
              background: "transparent", color: "#0f172a",
              width: 200, fontFamily: "'Segoe UI', sans-serif",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")}
              style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{
        padding: "116px 40px 60px",
        maxWidth: 1200, margin: "0 auto", boxSizing: "border-box",
      }}>

        {/* Active committee banner */}
        {activeCommittee !== "All Committees" && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: "#fff",
            border: `1.5px solid ${(COMMITTEES[activeCommittee]?.color || "#1a3557")}30`,
            borderLeft: `4px solid ${COMMITTEES[activeCommittee]?.color || "#1a3557"}`,
            borderRadius: 10, padding: "12px 20px", marginBottom: 28,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}>
            <span style={{ fontSize: 22 }}>{COMMITTEES[activeCommittee]?.icon}</span>
            <div>
              <div style={{ fontWeight: 800, color: "#0f172a", fontSize: 15 }}>
                Showing events by: {activeCommittee}
              </div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
                {ongoing.length + upcoming.length + past.length} event(s) found
              </div>
            </div>
            <button
              onClick={() => setActiveCommittee("All Committees")}
              style={{
                marginLeft: "auto", background: "none", border: "1px solid #e2e8f0",
                borderRadius: 6, padding: "5px 12px", fontSize: 12, color: "#64748b",
                cursor: "pointer", fontWeight: 600,
              }}
            >
              ✕ Clear
            </button>
          </div>
        )}

        {ongoing.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <SectionHeading label="Ongoing Events" color="#16a34a" count={ongoing.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
              {ongoing.slice(0, showOngoing).map(e => <EventCard key={e.id} event={e} />)}
            </div>
            {ongoing.length > showOngoing && <SeeMoreButton onClick={() => setShowOngoing(v => v + 3)} />}
          </div>
        )}

        {upcoming.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <SectionHeading label="Upcoming Events" color="#1d6fa4" count={upcoming.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
              {upcoming.slice(0, showUpcoming).map(e => <EventCard key={e.id} event={e} />)}
            </div>
            {upcoming.length > showUpcoming && <SeeMoreButton onClick={() => setShowUpcoming(v => v + 3)} />}
          </div>
        )}

        {past.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <SectionHeading label="Past Events" color="#64748b" count={past.length} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 28 }}>
              {past.slice(0, showPast).map(e => <EventCard key={e.id} event={e} past />)}
            </div>
            {past.length > showPast && <SeeMoreButton onClick={() => setShowPast(v => v + 3)} />}
          </div>
        )}

        {ongoing.length === 0 && upcoming.length === 0 && past.length === 0 && (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            background: "#fff", borderRadius: 12, border: "1px solid #e5e7eb",
          }}>
            <div style={{ fontSize: 40 }}>📭</div>
            <h3 style={{ color: "#0f172a", marginBottom: 6 }}>No events found</h3>
            <p style={{ color: "#94a3b8", fontSize: 14 }}>Try a different filter or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
}