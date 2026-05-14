import { useState } from "react";
import { useNavigate } from "react-router-dom";

const C = { navy: "#0d1b2a", navyMid: "#1b2d45", blue: "#2563eb", muted: "#94a3b8" };

export default function Contact() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setSent(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const inp = (field) => ({
    width: "100%", padding: "12px 15px",
    border: `1.5px solid ${errors[field] ? "#ef4444" : "#e2e8f0"}`,
    borderRadius: 10, fontFamily: "system-ui", fontSize: 14, color: C.navy,
    background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  });

  const faqs = [
    { q: "How do I register for an event?", a: "Go to the Events page, find your event and click 'Register Now'." },
    { q: "Can I cancel my registration?",   a: "Yes, contact us at least 24 hours before the event." },
    { q: "Are events open to all students?", a: "Most events are open to all students. Some may require prior enrollment." },
    { q: "How do I submit a photo to the gallery?", a: "Use the Upload Photos option in the Gallery section." },
  ];
  const [openFaq, setOpenFaq] = useState(null);

  const infos = [
    { icon: "📍", label: "Address",     value: "Techno India NJR Institute of Technology, Udaipur, Rajasthan" },
    { icon: "📧", label: "Email",       value: "events@smartevent.edu" },
    { icon: "📞", label: "Phone",       value: "+91 98765 43210" },
    { icon: "🕐", label: "Office Hours",value: "Mon – Fri, 9:00 AM – 5:00 PM" },
  ];

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
          Contact Us
        </h1>
        <p style={{ color: C.muted, fontSize: 15, margin: 0 }}>Have a question or feedback? We'd love to hear from you.</p>
      </div>

      {/* Info strip */}
      <div style={{ background: C.navy, padding: "32px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 20 }}>
          {infos.map((info, i) => (
            <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 22, flexShrink: 0 }}>{info.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: C.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>{info.label}</p>
                <p style={{ margin: "3px 0 0", fontSize: 14, color: "#fff" }}>{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>

          {/* Contact form */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 22, color: C.navy, margin: "0 0 22px" }}>
              Send a Message
            </h2>

            {sent && (
              <div style={{
                background: "#ecfdf5", border: "1px solid #6ee7b7", borderRadius: 12,
                padding: "14px 18px", marginBottom: 20,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>✅</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#065f46" }}>Message sent successfully!</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "#047857" }}>We'll get back to you within 24 hours.</p>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <input placeholder="Your Full Name" value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  style={inp("name")}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = errors.name ? "#ef4444" : "#e2e8f0"}/>
                {errors.name && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.name}</p>}
              </div>
              <div>
                <input placeholder="Email Address" type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  style={inp("email")}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = errors.email ? "#ef4444" : "#e2e8f0"}/>
                {errors.email && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.email}</p>}
              </div>
              <div>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  style={{ ...inp("subject"), color: form.subject ? C.navy : "#9ca3af" }}>
                  <option value="" disabled>Select Subject</option>
                  <option>Event Registration Query</option>
                  <option>Technical Issue</option>
                  <option>Gallery Upload</option>
                  <option>General Feedback</option>
                  <option>Other</option>
                </select>
                {errors.subject && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.subject}</p>}
              </div>
              <div>
                <textarea placeholder="Write your message here…" rows={5} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  style={{ ...inp("message"), resize: "vertical", minHeight: 120 }}
                  onFocus={e => e.target.style.borderColor = C.blue}
                  onBlur={e => e.target.style.borderColor = errors.message ? "#ef4444" : "#e2e8f0"}/>
                {errors.message && <p style={{ margin: "4px 0 0", fontSize: 12, color: "#ef4444" }}>{errors.message}</p>}
              </div>
              <button onClick={submit} style={{
                background: C.blue, color: "#fff", border: "none",
                borderRadius: 10, padding: "14px 0",
                fontFamily: "system-ui", fontWeight: 700, fontSize: 15,
                cursor: "pointer", width: "100%", transition: "background 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#1d4ed8"}
                onMouseLeave={e => e.currentTarget.style.background = C.blue}>
                Send Message →
              </button>
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 22, color: C.navy, margin: "0 0 20px" }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{
                  background: "#fff", borderRadius: 14,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  overflow: "hidden", transition: "all 0.2s",
                }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                    width: "100%", padding: "16px 18px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    fontFamily: "system-ui", fontWeight: 700, fontSize: 14, color: C.navy,
                    textAlign: "left",
                  }}>
                    {faq.q}
                    <span style={{
                      fontSize: 18, color: C.blue, flexShrink: 0, marginLeft: 10,
                      transform: openFaq === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s", display: "inline-block",
                    }}>+</span>
                  </button>
                  {openFaq === i && (
                    <div style={{ padding: "0 18px 16px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div style={{ marginTop: 24 }}>
              <h4 style={{ fontFamily: "system-ui", fontWeight: 700, fontSize: 14, color: C.navy, margin: "0 0 12px" }}>
                Follow Us
              </h4>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Instagram", "Twitter", "LinkedIn", "YouTube"].map(s => (
                  <div key={s} style={{
                    background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 10,
                    padding: "9px 16px", fontSize: 13, fontWeight: 600, color: C.navyMid,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.blue; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = C.blue; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.navyMid; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}