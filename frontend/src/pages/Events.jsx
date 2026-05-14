import { useState } from "react";

const ONGOING_EVENTS = [
  {
    id: 101,
    title: "Marathon",
    category: "Sports",
    day: "15",
    month: "May",
    time: "8:00 AM - 11:00 AM",
    location: "Dhemaji Engineering College, Dhemaji",
    description: "A marathon event organized as part of the annual Sports Week at Dhemaji Engineering College, bringing together students for endurance, fitness, and team spirit.",
    image: "/images/Event-image/marathon.jpeg"
  },
  {
    id: 102,
    title: "High Jump",
    category: "Sports",
    day: "15",
    month: "May",
    time: "10:00 AM - 11:00 AM",
    location: "Dhemaji Engineering College, Dhemaji",
    description: "An exciting high jump competition hosted during the Sports Week of Dhemaji Engineering College, encouraging athletic excellence and competitive spirit among participants.",
    image: "/images/Event-image/highjump.jpeg"
  },
  {
    id: 103,
    title: "Tug of War",
    category: "Sports",
    day: "15",
    month: "May",
    time: "12:30 PM - 2:00 PM",
    location: "Dhemaji Engineering College, Dhemaji",
    description: "A thrilling tug of war competition organized as part of the Dhemaji Engineering College Sports Week, focused on teamwork, strength, and coordination.",
    image: "/images/Event-image/tugofwar.jpeg"
  },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "Inter-Department Football Championship",
    category: "Sports",
    day: "16",
    month: "May",
    time: "11:00 AM – 4:00 PM",
    location: "Dhemaji Engineering College",
    description:
      "Celebrate Sports Day with an exciting football championship featuring teams from different departments of Dhemaji Engineering College. Enjoy a day full of sportsmanship, energy, and competitive spirit.",
    image:"/images/Event-image/Football.jpg",
  },

  {
    id: 2,
    title: "Kabaddi ",
    category: "Sports",
    day: "16",
    month: "May",
    time: "1:00 PM – 5:00 PM",
    location: "DEC Sports Ground, Dhemaji Engineering College",
    description:
      "An action-packed Kabaddi tournament organized as part of the annual Sports Day celebration. Witness thrilling raids, strong teamwork, and competitive matches among college teams.",
    image:"/images/Event-image/kabaddi.jpeg",
  },

  {
    id: 3,
    title: "Bootcamp on Competitive Programming",
    category: "Technology",
    day: "20",
    month: "May",
    time: "12:00 PM – 1:30 PM",
    location: "Seminar Hall, Dhemaji Engineering College",
    description:
      "A hands-on competitive programming bootcamp conducted by the Robotics and Coding Club. Learn problem-solving techniques, coding strategies, and tips for coding contests from experienced mentors.",
    image:"/images/Event-image/coding-bootcamp.jpeg",
  },

  {
    id: 4,
    title: "InnovateX Ideathon 2026",
    category: "Technology",
    day: "18",
    month: "May",
    time: "10:00 AM – 1:00 PM",
    location: "Robotics & Coding Club, Dhemaji Engineering College",
    description:
      "Join the Ideathon organized by the Robotics and Coding Club to brainstorm innovative tech solutions, collaborate with creative minds, and present impactful ideas to mentors and judges.",
    image:
      "/images/Event-image/ideathon.jpg",
  },

  {
    id: 5,
    title: "DEC Esports Showdown",
    category: "Technology",
    day: "21",
    month: "May",
    time: "4:00 PM – 7:00 PM",
    location: "Seminar Hall, Dhemaji Engineering College",
    description:
      "Get ready for an exciting esports competition featuring popular multiplayer games, team battles, and gaming challenges. Open for all students with exciting prizes for the winners.",
    image: "/images/Event-image/esports.jpg",
  },

  {
    id: 6,
    title: "Farewell Event Volunteer Recruitment",
    category: "Business",
    day: "24",
    month: "May",
    time: "11:00 AM – 2:00 PM",
    location: "Auditorium Hall, Dhemaji Engineering College",
    description:
      "Volunteers are invited to help organize and manage the upcoming farewell ceremony. Responsibilities include stage coordination, guest support, decoration management, and event assistance.",
    image: "/images/Event-image/farewell.jpeg",
  },
];

const PAST_EVENTS = [
  {
    id: 201,
    title: "Inter-Department Badminton Tournament",
    category: "Sports",
    day: "14",
    month: "May",
    time: "9:00 AM – 12:00 PM",
    location: "Mechanical Workshop, Dhemaji Engineering College",
    description:
      "An exciting badminton tournament between different departments of DEC held during the annual sports week.",
    image: "/images/Event-image/badminton.jpg",
  },

  {
    id: 202,
    title: "DEC Chess Championship",
    category: "Sports",
    day: "14",
    month: "May",
    time: "1:00 PM – 4:00 PM",
    location: "Mechanical Workshop, Dhemaji Engineering College",
    description:
      "A strategic chess competition where students showcased analytical thinking and competitive spirit.",
    image: "/images/Event-image/chess.jpg",
  },

  {
    id: 203,
    title: "Cricket League",
    category: "Sports",
    day: "14",
    month: "May",
    time: "8:00 AM – 3:00 PM",
    location: "Tekjuri Highschool Field",
    description:
      "A thrilling cricket tournament featuring energetic performances and strong team coordination among students.",
    image: "/images/Event-image/cricket.jpeg",
  },

  {
    id: 204,
    title: "Code Arena 2026",
    category: "Technology",
    day: "12",
    month: "May",
    time: "10:00 AM – 1:00 PM",
    location: "Computer Lab, Dhemaji Engineering College",
    description:
      "A competitive coding contest where participants solved real-world programming problems within limited time.",
    image: "/images/Event-image/codingbootcamp.jpg",
  },

  {
    id: 205,
    title: "DSA Coding Bootcamp",
    category: "Technology",
    day: "07",
    month: "May",
    time: "11:00 AM – 2:00 PM",
    location: "Seminar Hall, Dhemaji Engineering College",
    description:
      "A hands-on bootcamp on Data Structures and Algorithms organized by the Robotics & Coding Club.",
    image: "/images/Event-image/DSA.jpg",
  },

  {
    id: 206,
    title: "Wall Painting Competition",
    category: "Art",
    day: "05",
    month: "May",
    time: "10:00 AM – 1:00 PM",
    location: "Academic Block, Dhemaji Engineering College",
    description:
      "A creative wall painting competition where students expressed artistic ideas through vibrant campus artwork.",
    image: "/images/Event-image/wallpainting.jpg",
  },
];

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
          border: "2px solid #1a3557",
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Segoe UI', sans-serif",
          letterSpacing: "0.03em",
          transition: "all 0.2s",
        }}
      >
        See More →
      </button>
    </div>
  );
}

function SectionHeading({ label, color, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
      <div style={{ width: 4, height: 28, background: color, borderRadius: 4 }} />
      <h2 style={{
        margin: 0, fontSize: 22, fontWeight: 800,
        color: "#0f172a", fontFamily: "'Georgia', serif",
        letterSpacing: "-0.3px",
      }}>
        {label}
      </h2>
      <span style={{
        background: color + "20", color: color,
        fontSize: 12, fontWeight: 700,
        padding: "3px 10px", borderRadius: 20,
      }}>
        {count} Events
      </span>
    </div>
  );
}

function EventCard({ event, past }) {
  const [hov, setHov] = useState(false);
  const accent = CAT_COLOR[event.category] || "#e85d26";

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: hov ? "0 10px 36px rgba(0,0,0,0.13)" : "0 2px 10px rgba(0,0,0,0.07)",
        transform: hov ? "translateY(-4px)" : "none",
        transition: "all 0.25s ease",
        border: "1px solid #e5e7eb",
        cursor: "pointer",
        opacity: past ? 0.85 : 1,
      }}
    >
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <img
          src={event.image}
          alt={event.title}
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            transform: hov ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.4s ease",
            filter: past ? "grayscale(30%)" : "none",
          }}
        />
        {past && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.25)" }} />
        )}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          background: past ? "#64748b" : accent,
          color: "#fff", padding: "8px 14px",
          textAlign: "center", minWidth: 52,
        }}>
          <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>{event.day}</div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 2 }}>{event.month}</div>
        </div>
        {past && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "#475569", color: "#fff",
            fontSize: 10, fontWeight: 700,
            padding: "3px 10px", borderRadius: 20,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Ended
          </div>
        )}
      </div>

      <div style={{ padding: "18px 20px 20px" }}>
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
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12, color: "#94a3b8", flexWrap: "wrap", gap: 6,
        }}>
          <span>🕐 {event.time}</span>
          <span style={{ color: past ? "#64748b" : accent, fontWeight: 600, fontSize: 12 }}>
            📍 {event.location}
          </span>
        </div>
        <button style={{
          marginTop: 16, width: "100%", padding: "10px 0",
          background: past ? "#f1f5f9" : (hov ? accent : "#f1f5f9"),
          color: past ? "#94a3b8" : (hov ? "#fff" : "#475569"),
          border: "none", borderRadius: 7,
          fontWeight: 700, fontSize: 13, cursor: past ? "default" : "pointer",
          transition: "all 0.2s", fontFamily: "'Segoe UI', sans-serif",
          letterSpacing: "0.02em",
        }}>
          {past ? "View Summary" : "Register Now →"}
        </button>
      </div>
    </div>
  );
}

export default function Events() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [showOngoing, setShowOngoing] = useState(INITIAL_SHOW);
  const [showUpcoming, setShowUpcoming] = useState(INITIAL_SHOW);
  const [showPast, setShowPast] = useState(INITIAL_SHOW);

  const filterList = (list) => list.filter(e => {
    const matchCat = activeCategory === "All" || e.category === activeCategory;
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const ongoing  = filterList(ONGOING_EVENTS);
  const upcoming = filterList(UPCOMING_EVENTS);
  const past     = filterList(PAST_EVENTS);

  // Navbar = 64px, Filter bar = 52px → total offset for content = 116px
  return (
    <div style={{ width: "100%", minHeight: "100vh", background: "#f5f6fa", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* Filter bar: fixed, flush under the navbar */}
      <div style={{
        position: "fixed",
        top: 64,        /* sits exactly below the 64px navbar */
        left: 0,
        right: 0,
        zIndex: 998,    /* below navbar (999) but above content */
        background: "#fff",
        borderBottom: "1px solid #e5e7eb",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        padding: "14px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
              style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}>✕</button>
          )}
        </div>
      </div>

      {/* Main content pushed down by navbar (64) + filter bar (52) = 116px */}
      <div style={{
        paddingTop: 116,
        padding: "116px 40px 60px",
        maxWidth: 1200,
        margin: "0 auto",
        boxSizing: "border-box",
      }}>

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