import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d1b2a 0%, #1b2d45 60%, #0f3460 100%)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "24px",
      fontFamily: "system-ui, sans-serif",
    }}>
      {/* Big 404 */}
      <div style={{
        fontSize: "clamp(80px, 18vw, 160px)",
        fontFamily: "Georgia, serif", fontWeight: 700,
        color: "transparent",
        WebkitTextStroke: "2px rgba(37,99,235,0.6)",
        lineHeight: 1, marginBottom: 8, userSelect: "none",
      }}>404</div>

      <div style={{
        width: 60, height: 3, borderRadius: 2,
        background: "#2563eb", margin: "0 auto 24px",
      }}/>

      <h1 style={{
        fontFamily: "Georgia, serif", fontWeight: 700,
        fontSize: "clamp(22px, 4vw, 36px)", color: "#fff",
        margin: "0 0 12px",
      }}>Page Not Found</h1>

      <p style={{ color: "#94a3b8", fontSize: 16, margin: "0 0 40px", maxWidth: 400, lineHeight: 1.6 }}>
        Looks like this page took a day off. The event you're looking for doesn't exist or has been moved.
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => navigate("/")} style={{
          background: "#2563eb", color: "#fff", border: "none",
          borderRadius: 12, padding: "13px 28px",
          fontFamily: "system-ui", fontWeight: 700, fontSize: 15,
          cursor: "pointer", transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
          onMouseLeave={e => e.currentTarget.style.background = "#2563eb"}>
          🏠 Go Home
        </button>
        <button onClick={() => navigate("/Events")} style={{
          background: "rgba(255,255,255,0.08)", color: "#fff",
          border: "1.5px solid rgba(255,255,255,0.2)",
          borderRadius: 12, padding: "13px 28px",
          fontFamily: "system-ui", fontWeight: 700, fontSize: 15,
          cursor: "pointer", transition: "background 0.2s",
        }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
          📅 View Events
        </button>
      </div>

      {/* Quick links */}
      <div style={{ marginTop: 48, display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { label: "Events",   path: "/Events" },
          { label: "Gallery",  path: "/Gallery" },
          { label: "Calendar", path: "/Calendar" },
          { label: "Contact",  path: "/Contact" },
        ].map(({ label, path }) => (
          <button key={label} onClick={() => navigate(path)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#94a3b8", fontSize: 14, fontFamily: "system-ui",
            textDecoration: "underline", textUnderlineOffset: 3,
            transition: "color 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.color = "#fff"}
            onMouseLeave={e => e.currentTarget.style.color = "#94a3b8"}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}