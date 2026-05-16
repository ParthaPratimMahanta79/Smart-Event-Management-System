import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const C = {
  navy: "#0d1b2a",
  navyMid: "#1b2d45",
  blue: "#2563eb",
  text: "#e2e8f0",
  muted: "#94a3b8",
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const EVENT_DATES = {
  "2026-5": [5, 12, 18, 22, 27],
  "2026-6": [3, 10, 15, 20, 25],
  "2026-7": [1, 8, 14, 22, 30],
};

/* ── Hero ── */
function Hero({ navigate }) {
  return (
    <section id="home" style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg,rgba(13,27,42,0.70) 0%,rgba(13,27,42,0.55) 50%,rgba(13,27,42,0.88) 100%), url('/images/BG PHOTO.jpeg') center/cover no-repeat",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "0 24px", position: "relative",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
        <div style={{ width: 52, height: 1, background: C.blue }}/>
        <p style={{ margin: 0, color: C.blue, fontSize: 13, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "system-ui" }}>
          Welcome to
        </p>
        <div style={{ width: 52, height: 1, background: C.blue }}/>
      </div>
      <h1 style={{
        margin: "0 0 18px", fontSize: "clamp(36px,7vw,78px)",
        fontFamily: "Georgia,'Times New Roman',serif",
        fontWeight: 700, color: "#fff", lineHeight: 1.1,
      }}>
        Smart Event<br/>Management
      </h1>
      <p style={{ margin: "0 0 8px", color: C.text, fontSize: 20, fontWeight: 600, fontFamily: "system-ui" }}>
        Organize. Manage. Celebrate.
      </p>
      <p style={{ margin: "0 0 44px", color: C.muted, fontSize: 15, fontFamily: "system-ui" }}>
        All your events, in one smart platform.
      </p>
      <button onClick={() => navigate("/Events")} style={{
        background: C.blue, color: "#fff",
        fontFamily: "system-ui", fontWeight: 700, fontSize: 16,
        border: "none", borderRadius: 12, padding: "16px 36px",
        cursor: "pointer", boxShadow: "0 8px 28px rgba(37,99,235,0.45)",
        transition: "background 0.2s, transform 0.15s",
      }}
        onMouseEnter={e => { e.currentTarget.style.background="#1d4ed8"; e.currentTarget.style.transform="translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.background=C.blue; e.currentTarget.style.transform="translateY(0)"; }}>
        View Events
      </button>
    </section>
  );
}

/* ── Calendar ── */
function CalendarSection() {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear]   = useState(today.getFullYear());
  const key = `${year}-${month+1}`;
  const eventDays = new Set(EVENT_DATES[key] || []);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const cells = Array.from({ length: firstDay+daysInMonth }, (_, i) => i < firstDay ? null : i-firstDay+1);
  const upcoming = [
    { day:8, title:"Sports Weekend",         cat:"Sports", color:"#3B82F6" },
    { day:10, title:"End of Sports Week",        cat:"Sports", color:"#8B5CF6" },
    { day:12, title:"Hackathon", cat:"Technology", color:"#8B5CF6" },
    { day:18, title:"Campus Music Festival",  cat:"Music",      color:"#EC4899" },
    { day:22, title:"AI Workshop",            cat:"Workshop",   color:"#10B981" },
    { day:27, title:"Art Exhibition",         cat:"Arts",       color:"#F59E0B" },
  ];
  const prev = () => month===0 ? (setMonth(11),setYear(y=>y-1)) : setMonth(m=>m-1);
  const next = () => month===11? (setMonth(0), setYear(y=>y+1)) : setMonth(m=>m+1);

  return (
    <section id="calendar" style={{
      minHeight:"100vh", background:"#f0f4f8",
      padding:"90px 24px 80px", display:"flex", flexDirection:"column", alignItems:"center",
    }}>
      <p style={{ color:C.blue, fontSize:13, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", margin:"0 0 10px", fontFamily:"system-ui" }}>Plan Ahead</p>
      <h2 style={{ fontFamily:"Georgia,serif", fontWeight:700, fontSize:"clamp(26px,4vw,42px)", color:C.navy, margin:"0 0 44px", textAlign:"center" }}>Event Calendar</h2>
      <div style={{ display:"grid", gridTemplateColumns:"minmax(0,1fr) 300px", gap:24, maxWidth:940, width:"100%" }}>
        <div style={{ background:"#fff", borderRadius:20, padding:28, boxShadow:"0 4px 20px rgba(0,0,0,0.07)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
            <button onClick={prev} style={{ width:34,height:34,borderRadius:8,border:"none",background:"#f1f5f9",cursor:"pointer",fontSize:18,color:C.navyMid }}>‹</button>
            <h3 style={{ margin:0, fontFamily:"system-ui", fontWeight:700, fontSize:17, color:C.navy }}>{MONTHS[month]} {year}</h3>
            <button onClick={next} style={{ width:34,height:34,borderRadius:8,border:"none",background:"#f1f5f9",cursor:"pointer",fontSize:18,color:C.navyMid }}>›</button>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:6 }}>
            {DAYS.map(d=><div key={d} style={{ textAlign:"center",fontSize:12,fontWeight:700,color:C.muted,fontFamily:"system-ui",padding:"4px 0" }}>{d}</div>)}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
            {cells.map((day,i)=>{
              const isToday = day===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
              const hasEvent = day&&eventDays.has(day);
              return (
                <div key={i} style={{
                  aspectRatio:"1", borderRadius:9,
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                  background:isToday?C.blue:hasEvent?"#eff6ff":"transparent",
                  color:isToday?"#fff":day?C.navy:"transparent",
                  fontFamily:"system-ui", fontSize:13, fontWeight:isToday?700:500,
                  cursor:day?"pointer":"default", position:"relative", transition:"background 0.15s",
                }}
                onMouseEnter={e=>{ if(day&&!isToday) e.currentTarget.style.background="#f1f5f9"; }}
                onMouseLeave={e=>{ if(day&&!isToday) e.currentTarget.style.background=hasEvent?"#eff6ff":"transparent"; }}>
                  {day||""}
                  {hasEvent&&!isToday&&<div style={{ width:4,height:4,borderRadius:"50%",background:C.blue,position:"absolute",bottom:4 }}/>}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          <h4 style={{ margin:"0 0 4px", fontFamily:"system-ui", fontWeight:700, fontSize:16, color:C.navy }}>This Month's Events</h4>
          {upcoming.map((ev,i)=>(
            <div key={i} style={{
              background:"#fff", borderRadius:14, borderLeft:`4px solid ${ev.color}`,
              padding:"16px 18px", boxShadow:"0 2px 8px rgba(0,0,0,0.05)",
              display:"flex", alignItems:"center", gap:14,
            }}>
              <div style={{ width:46,height:46,borderRadius:10,background:ev.color+"18",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
                <span style={{ color:ev.color,fontWeight:800,fontSize:17,lineHeight:1 }}>{ev.day}</span>
                <span style={{ color:ev.color,fontWeight:600,fontSize:10 }}>{MONTHS[month].slice(0,3).toUpperCase()}</span>
              </div>
              <div>
                <p style={{ margin:0,fontFamily:"system-ui",fontWeight:700,fontSize:13,color:C.navy }}>{ev.title}</p>
                <span style={{ background:ev.color+"22",color:ev.color,fontSize:11,fontWeight:700,borderRadius:5,padding:"2px 8px",fontFamily:"system-ui" }}>{ev.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Contact ── */
function ContactSection() {
  const [form, setForm] = useState({ name:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  const submit = () => {
    if (!form.name||!form.email||!form.message) return;
    setSent(true); setForm({ name:"",email:"",message:"" });
    setTimeout(()=>setSent(false), 4000);
  };
  const inp = {
    width:"100%", padding:"12px 15px", border:"1.5px solid #e2e8f0",
    borderRadius:10, fontFamily:"system-ui", fontSize:14, color:C.navy,
    background:"#fff", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s",
  };
  const infos = [
    {  label:"Address :", value:"Dhemaji Engineering College, Tekjuri" },
    {  label:"Email :",   value:"xyz@gmail.com" },
    {  label:"Contact :",   value:"+91 93xxxxxx03" },
    {  label:"Open :",   value:"Mon – Fri, 8 AM – 4 PM" },
  ];
  return (
    <section id="contact" style={{
      minHeight:"100vh", background:C.navy,
      padding:"90px 24px 80px", display:"flex", flexDirection:"column", alignItems:"center",
    }}>
      <p style={{ color:C.blue,fontSize:13,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",margin:"0 0 10px",fontFamily:"system-ui" }}></p>
      <h2 style={{ fontFamily:"Georgia,serif",fontWeight:700,fontSize:"clamp(26px,4vw,42px)",color:"#fff",margin:"0 0 12px",textAlign:"center" }}>Contact Us</h2>
      <p style={{ color:C.muted,fontSize:15,margin:"0 0 48px",textAlign:"center",fontFamily:"system-ui" }}>Have questions about an event? We'd love to hear from you.</p>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:32,maxWidth:940,width:"100%" }}>
        <div style={{ background:"#fff",borderRadius:20,padding:30 }}>
          <h3 style={{ fontFamily:"system-ui",fontWeight:700,fontSize:19,color:C.navy,margin:"0 0 20px" }}>Send a Message</h3>
          {sent&&<div style={{ background:"#ecfdf5",border:"1px solid #6ee7b7",borderRadius:10,padding:"11px 15px",marginBottom:16,color:"#065f46",fontFamily:"system-ui",fontSize:14,fontWeight:600 }}>✓ Message sent!</div>}
          <div style={{ display:"flex",flexDirection:"column",gap:13 }}>
            <input placeholder="Your Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} style={inp} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
            <input placeholder="Email Address" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} style={inp} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
            <textarea placeholder="Your message…" rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} style={{...inp,resize:"vertical",minHeight:110}} onFocus={e=>e.target.style.borderColor=C.blue} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
            <button onClick={submit} style={{ background:C.blue,color:"#fff",border:"none",borderRadius:10,padding:"13px 0",fontFamily:"system-ui",fontWeight:700,fontSize:15,cursor:"pointer",width:"100%",transition:"background 0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="#1d4ed8"} onMouseLeave={e=>e.currentTarget.style.background=C.blue}>
              Send Message →
            </button>
          </div>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:14 }}>
          {infos.map((info,i)=>(
            <div key={i} style={{ background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.09)",borderRadius:14,padding:"18px 20px",display:"flex",gap:14,alignItems:"flex-start" }}>
              <span style={{ fontSize:22,flexShrink:0 }}>{info.icon}</span>
              <div>
                <p style={{ margin:0,fontFamily:"system-ui",fontWeight:700,fontSize:11,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase" }}>{info.label}</p>
                <p style={{ margin:"4px 0 0",fontFamily:"system-ui",fontSize:14,color:"#fff" }}>{info.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ════════ ROOT ════════ */
export default function Home() {
  const navigate = useNavigate();
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  return (
    <div style={{ margin:0, padding:0, overflowX:"hidden" }}>
      <Hero navigate={navigate}/>
      <CalendarSection/>
      <ContactSection/>
    </div> 
  );
}