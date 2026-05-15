import { useState } from "react";
import { useNavigate } from "react-router-dom";


const C = { navy: "#0d1b2a", navyMid: "#1b2d45", blue: "#2563eb", muted: "#94a3b8" };
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const ALL_EVENTS = {
  "2026-5": [
    { day:5,  title:"Science Quiz",          cat:"Science",    color:"#3B82F6", time:"10:00 AM", venue:"Lab Block A" },
    { day:12, title:"Tech Summit",           cat:"Technology", color:"#8B5CF6", time:"9:00 AM",  venue:"Seminar Hall" },
    { day:18, title:"Music Festival",        cat:"Music",      color:"#EC4899", time:"5:00 PM",  venue:"Open Air Stage" },
    { day:22, title:"AI Workshop",           cat:"Workshop",   color:"#10B981", time:"2:00 PM",  venue:"Computer Lab 1" },
    { day:27, title:"Art Exhibition",        cat:"Arts",       color:"#F59E0B", time:"11:00 AM", venue:"Campus Gallery" },
  ],
  "2026-6": [
    { day:3,  title:"Sports Day",            cat:"Sports",     color:"#EF4444", time:"8:00 AM",  venue:"University Stadium" },
    { day:10, title:"Research Seminar",      cat:"Seminar",    color:"#6366F1", time:"3:00 PM",  venue:"Conference Room B" },
    { day:15, title:"Cultural Night",        cat:"Arts",       color:"#F59E0B", time:"6:00 PM",  venue:"Auditorium" },
    { day:20, title:"Web Dev Bootcamp",      cat:"Technology", color:"#8B5CF6", time:"10:00 AM", venue:"IT Block, Lab 3" },
    { day:25, title:"Freshers' Welcome",     cat:"Social",     color:"#EC4899", time:"4:00 PM",  venue:"Main Ground" },
  ],
  "2026-7": [
    { day:1,  title:"Independence Lecture",  cat:"Seminar",    color:"#6366F1", time:"10:00 AM", venue:"Auditorium A" },
    { day:8,  title:"Photography Walk",      cat:"Arts",       color:"#F59E0B", time:"7:00 AM",  venue:"Campus Grounds" },
    { day:14, title:"Robotics Demo",         cat:"Technology", color:"#8B5CF6", time:"1:00 PM",  venue:"Engineering Block" },
    { day:22, title:"Annual Sports Meet",    cat:"Sports",     color:"#EF4444", time:"8:00 AM",  venue:"University Stadium" },
    { day:30, title:"Farewell Ceremony",     cat:"Social",     color:"#EC4899", time:"5:00 PM",  venue:"Main Auditorium" },
  ],
};

export default function Calendar() {
  const navigate = useNavigate();
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear]   = useState(today.getFullYear());
  const [selected, setSelected] = useState(null);

  const key = `${year}-${month + 1}`;
  const monthEvents = ALL_EVENTS[key] || [];
  const eventDays = new Set(monthEvents.map(e => e.day));

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) =>
    i < firstDay ? null : i - firstDay + 1
  );

  const prev = () => month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1);
  const next = () => month === 11 ? (setMonth(0),  setYear(y => y+1)) : setMonth(m => m+1);

  const selectedEvent = selected ? monthEvents.find(e => e.day === selected) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0d1b2a 0%, #1b2d45 60%, #0f3460 100%)",
        padding: "64px 24px 40px", textAlign: "center", position: "relative",
      }}>
        <button onClick={() => navigate("/")} style={{
          position: "absolute", top: 20, left: 24,
          background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)",
          color: "#fff", borderRadius: 8, padding: "7px 16px",
          cursor: "pointer", fontSize: 14, fontFamily: "system-ui",
        }}>← Back</button>
        <p style={{ color: C.blue, fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 10px" }}>
          Smart Event Management
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,5vw,52px)", fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>
          Event Calendar
        </h1>
        <p style={{ color: C.muted, fontSize: 15, margin: 0 }}>Browse and track all upcoming campus events</p>
      </div>

      {/* Main */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 28 }}>

          {/* Calendar widget */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <button onClick={prev} style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: 20, color: C.navyMid }}>‹</button>
              <h2 style={{ margin: 0, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 22, color: C.navy }}>
                {MONTHS[month]} {year}
              </h2>
              <button onClick={next} style={{ width: 38, height: 38, borderRadius: 10, border: "none", background: "#f1f5f9", cursor: "pointer", fontSize: 20, color: C.navyMid }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4, marginBottom: 8 }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: C.muted, padding: "4px 0" }}>{d}</div>
              ))}
            </div>

            {/* Cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 4 }}>
              {cells.map((day, i) => {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                const hasEvent = day && eventDays.has(day);
                const isSelected = day === selected;
                const ev = hasEvent ? monthEvents.find(e => e.day === day) : null;
                return (
                  <div key={i} onClick={() => day && setSelected(isSelected ? null : day)} style={{
                    aspectRatio: "1", borderRadius: 10,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    background: isSelected ? C.blue : isToday ? C.navyMid : hasEvent ? "#eff6ff" : "transparent",
                    color: isSelected || isToday ? "#fff" : day ? C.navy : "transparent",
                    fontWeight: (isToday || isSelected) ? 700 : 500,
                    fontSize: 14, cursor: day ? "pointer" : "default",
                    position: "relative", transition: "all 0.15s",
                    border: isSelected ? `2px solid ${C.blue}` : "2px solid transparent",
                  }}
                  onMouseEnter={e => { if (day && !isSelected && !isToday) e.currentTarget.style.background = "#f1f5f9"; }}
                  onMouseLeave={e => { if (day && !isSelected && !isToday) e.currentTarget.style.background = hasEvent ? "#eff6ff" : "transparent"; }}>
                    {day || ""}
                    {hasEvent && !isSelected && (
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: ev.color, position: "absolute", bottom: 5 }}/>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #f1f5f9", display: "flex", gap: 20, flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.blue }}/>
                <span style={{ fontSize: 12, color: C.muted }}>Selected</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#8B5CF6" }}/>
                <span style={{ fontSize: 12, color: C.muted }}>Has event</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: C.navyMid }}/>
                <span style={{ fontSize: 12, color: C.muted }}>Today</span>
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Selected event detail */}
            {selectedEvent && (
              <div style={{
                background: "#fff", borderRadius: 16, overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                borderTop: `4px solid ${selectedEvent.color}`,
              }}>
                <div style={{ padding: "20px 20px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <span style={{
                      background: selectedEvent.color + "22", color: selectedEvent.color,
                      fontSize: 11, fontWeight: 700, borderRadius: 6, padding: "3px 10px",
                    }}>{selectedEvent.cat}</span>
                    <span style={{ fontSize: 13, color: C.muted }}>{selected} {MONTHS[month].slice(0,3)}</span>
                  </div>
                  <h3 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 700, color: C.navy, fontFamily: "Georgia, serif" }}>{selectedEvent.title}</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#6b7280", fontSize: 13 }}>
                      <span>🕐</span> {selectedEvent.time}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", color: "#6b7280", fontSize: 13 }}>
                      <span>📍</span> {selectedEvent.venue}
                    </div>
                  </div>
                  <button onClick={() => navigate("/Events")} style={{
                    marginTop: 16, width: "100%", padding: "10px 0",
                    background: selectedEvent.color, color: "#fff", border: "none",
                    borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: "pointer",
                    fontFamily: "system-ui",
                  }}>Register Now →</button>
                </div>
              </div>
            )}

            {/* All events this month */}
            <div>
              <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: C.navy }}>
                {MONTHS[month]}'s Events
                <span style={{
                  marginLeft: 8, background: "#eff6ff", color: C.blue,
                  fontSize: 12, fontWeight: 700, borderRadius: 6, padding: "2px 8px",
                }}>{monthEvents.length}</span>
              </h4>
              {monthEvents.length === 0 ? (
                <div style={{ background: "#fff", borderRadius: 14, padding: "24px", textAlign: "center", color: C.muted, fontSize: 14 }}>
                  No events this month
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {monthEvents.map((ev, i) => (
                    <div key={i} onClick={() => setSelected(ev.day)} style={{
                      background: selected === ev.day ? "#eff6ff" : "#fff",
                      borderRadius: 12, borderLeft: `4px solid ${ev.color}`,
                      padding: "13px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
                      transition: "all 0.15s",
                    }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: 10, background: ev.color + "18",
                        display: "flex", flexDirection: "column", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                      }}>
                        <span style={{ color: ev.color, fontWeight: 800, fontSize: 16, lineHeight: 1 }}>{ev.day}</span>
                        <span style={{ color: ev.color, fontWeight: 600, fontSize: 9 }}>{MONTHS[month].slice(0,3).toUpperCase()}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: C.navy, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.title}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: C.muted }}>{ev.time} · {ev.venue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}