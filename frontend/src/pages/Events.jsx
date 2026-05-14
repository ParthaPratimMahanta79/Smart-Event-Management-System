import { useState } from "react";

const ONGOING_EVENTS = [
  {
    id: 101,
    title: "Global Tech Expo 2026",
    category: "Technology",
    day: "13",
    month: "May",
    time: "9:00 AM – 8:00 PM",
    location: "Pragati Maidan, Delhi",
    description: "A week-long exposition showcasing cutting-edge technology from startups and enterprises across the globe.",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  },
  {
    id: 102,
    title: "Spring Art Walk",
    category: "Art",
    day: "10",
    month: "May",
    time: "10:00 AM – 6:00 PM",
    location: "Cubbon Park, Bangalore",
    description: "An ongoing outdoor art exhibition featuring installations and paintings by local and national artists.",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=80",
  },
  {
    id: 103,
    title: "Entrepreneurship Bootcamp",
    category: "Business",
    day: "12",
    month: "May",
    time: "8:00 AM – 5:00 PM",
    location: "T-Hub, Hyderabad",
    description: "A 5-day intensive bootcamp helping early-stage founders build, validate and pitch their ideas.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80",
  },
];

const UPCOMING_EVENTS = [
  {
    id: 1,
    title: "National Science Seminar 2026",
    category: "Science",
    day: "20",
    month: "Jun",
    time: "10:00 AM – 4:00 PM",
    location: "IIT Guwahati, Assam",
    description: "Join researchers and students for a day of groundbreaking science presentations and panel discussions.",
    image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=600&q=80",
  },
  {
    id: 2,
    title: "Tech Innovators Meetup",
    category: "Technology",
    day: "05",
    month: "Jul",
    time: "2:00 PM – 6:00 PM",
    location: "Startup Hub, Bangalore",
    description: "Network with top engineers and entrepreneurs shaping the future of technology in India.",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    id: 3,
    title: "Contemporary Art Exhibition",
    category: "Art",
    day: "12",
    month: "Jul",
    time: "11:00 AM – 7:00 PM",
    location: "National Gallery, Delhi",
    description: "Explore bold new works from emerging and established artists across various mediums.",
    image: "https://images.unsplash.com/photo-1536924940846-227afb31e2a5?w=600&q=80",
  },
  {
    id: 4,
    title: "Indie Music Festival",
    category: "Music",
    day: "18",
    month: "Jul",
    time: "5:00 PM – 11:00 PM",
    location: "Shillong, Meghalaya",
    description: "A celebration of independent artists performing live across multiple outdoor stages.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80",
  },
  {
    id: 5,
    title: "Startup Pitch Competition",
    category: "Business",
    day: "22",
    month: "Jul",
    time: "9:00 AM – 5:00 PM",
    location: "NSIC, Hyderabad",
    description: "Present your startup idea to top investors and win funding to launch your vision.",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=600&q=80",
  },
  {
    id: 6,
    title: "Regional Athletics Championship",
    category: "Sports",
    day: "30",
    month: "Jul",
    time: "8:00 AM – 6:00 PM",
    location: "SAI Stadium, Guwahati",
    description: "Watch elite athletes from across the region compete in track, field, and relay events.",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&q=80",
  },
];

const PAST_EVENTS = [
  {
    id: 201,
    title: "Winter Coding Hackathon",
    category: "Technology",
    day: "15",
    month: "Jan",
    time: "9:00 AM – 9:00 PM",
    location: "NIT Silchar, Assam",
    description: "48 hours of non-stop coding where teams built real-world solutions for local problems.",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&q=80",
  },
  {
    id: 202,
    title: "Cultural Heritage Festival",
    category: "Art",
    day: "26",
    month: "Jan",
    time: "10:00 AM – 8:00 PM",
    location: "Nehru Stadium, Guwahati",
    description: "A vibrant showcase of Northeast India's folk dances, crafts, and culinary traditions.",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80",
  },
  {
    id: 203,
    title: "Science Quiz Championship",
    category: "Science",
    day: "10",
    month: "Feb",
    time: "10:00 AM – 4:00 PM",
    location: "Cotton University, Guwahati",
    description: "Inter-college science quiz drawing hundreds of participants from across Assam.",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
  },
  {
    id: 204,
    title: "Half Marathon 2026",
    category: "Sports",
    day: "02",
    month: "Mar",
    time: "6:00 AM – 11:00 AM",
    location: "Guwahati Riverfront",
    description: "Over 3,000 runners participated in the annual half marathon along the Brahmaputra.",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&q=80",
  },
  {
    id: 205,
    title: "Business Leadership Summit",
    category: "Business",
    day: "20",
    month: "Mar",
    time: "9:00 AM – 6:00 PM",
    location: "Hotel Radisson, Guwahati",
    description: "Senior leaders from top companies shared insights on strategy, growth, and innovation.",
    image: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=600&q=80",
  },
  {
    id: 206,
    title: "Jazz & Blues Night",
    category: "Music",
    day: "05",
    month: "Apr",
    time: "7:00 PM – 11:00 PM",
    location: "Alliance Française, Delhi",
    description: "An intimate evening of live jazz and blues performed by celebrated Indian and international musicians.",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&q=80",
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