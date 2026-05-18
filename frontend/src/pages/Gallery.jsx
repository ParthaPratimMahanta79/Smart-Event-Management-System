import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadPhoto, getGallery } from "../services/api";
import { openLoginModal } from "../components/Navbar";

const LOCAL_IMAGES = [
  { id: "l1",  src: "/images/ArcanixPhoto.jpeg",         name: "ArcanixPhoto.jpeg",         size: "2.1 MB" },
  { id: "l2",  src: "/images/Arcanix(techFest).jpeg",    name: "Arcanix(techFest).jpeg",    size: "2.1 MB" },
  { id: "l3",  src: "/images/Bootcamp.jpeg",             name: "Bootcamp.jpeg",             size: "1.9 MB" },
  { id: "l4",  src: "/images/CampusCeremony.jpeg",       name: "CampusCeremony.jpeg",       size: "2.3 MB" },
  { id: "l5",  src: "/images/Freshers.jpeg",             name: "Freshers.jpeg",             size: "2.0 MB" },
  { id: "l6",  src: "/images/Fresherss.jpeg",            name: "Fresherss.jpeg",            size: "2.0 MB" },
  { id: "l7",  src: "/images/sessionsDec.jpeg",          name: "sessionsDec.jpeg",          size: "2.0 MB" },
  { id: "l8",  src: "/images/Teachers Day.jpeg",         name: "Teachers Day.jpeg",         size: "2.0 MB" },
  { id: "l9",  src: "/images/Teachersday.jpeg",          name: "Teachersday.jpeg",          size: "2.0 MB" },
  { id: "l10", src: "/images/TeachersdaySpeech.jpeg",    name: "TeachersdaySpeech.jpeg",    size: "2.0 MB" },
  { id: "l11", src: "/images/TributeToZubeenDa.jpeg",    name: "TributeToZubeenDa.jpeg",    size: "2.0 MB" },
  { id: "l12", src: "/images/ZubeenGargTribute.jpeg",    name: "ZubeenGargTribute.jpeg",    size: "2.0 MB" },
];

const INITIAL_VISIBLE = 12;

export default function Gallery() {
  const { isLoggedIn } = useAuth();
  const fileInputRef = useRef(null);

  const [showAll,      setShowAll]      = useState(false);
  const [lightbox,     setLightbox]     = useState(null);
  const [uploading,    setUploading]    = useState(false);
  const [uploadMsg,    setUploadMsg]    = useState(null);
  const [backendImgs,  setBackendImgs]  = useState([]);

  // ── NEW: upload-modal state ──────────────────────────────────────────────
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [description,     setDescription]     = useState("");
  // ─────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    getGallery().then(res => {
      if (res.success && res.photos?.length) {
        const mapped = res.photos.map(p => ({
          id: p._id,
          src: `http://localhost:5001${p.image}`,
          name: p.title || p.image.split("/").pop(),
          size: "Uploaded",
          uploadedBy: p.uploadedBy?.name || "User",
        }));
        setBackendImgs(mapped);
      }
    }).catch(() => {});
  }, []);

  const allImages    = [...backendImgs, ...LOCAL_IMAGES];
  const visibleImages = showAll ? allImages : allImages.slice(0, INITIAL_VISIBLE);

  // ── CHANGED: open modal instead of file picker directly ──────────────────
  const handleUploadClick = () => {
    if (!isLoggedIn) { openLoginModal(); return; }
    setDescription("");
    setShowUploadModal(true);
  };

  // ── NEW: called when user confirms inside the modal ──────────────────────
  const handleModalProceed = () => {
    if (!description.trim()) return; // description is required
    setShowUploadModal(false);
    fileInputRef.current?.click();
  };
  // ─────────────────────────────────────────────────────────────────────────

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) { setUploadMsg({ type: "error", text: "Only JPG, PNG, or WEBP images are allowed." }); return; }
    if (file.size > 10 * 1024 * 1024) { setUploadMsg({ type: "error", text: "File must be under 10 MB." }); return; }

    setUploading(true); setUploadMsg(null);
    try {
      const formData = new FormData();
      formData.append("image", file);
      // ── CHANGED: attach the description the user typed ───────────────────
      formData.append("title", description.trim());
      // ─────────────────────────────────────────────────────────────────────
      const res = await uploadPhoto(formData);
      if (res.success) {
        setUploadMsg({ type: "success", text: "✅ Photo uploaded! It will appear after admin approval." });
      } else {
        setUploadMsg({ type: "error", text: res.message || "Upload failed. Please try again." });
      }
    } catch {
      setUploadMsg({ type: "error", text: "Server error. Please try again." });
    } finally {
      setUploading(false);
      setDescription("");
      setTimeout(() => setUploadMsg(null), 6000);
    }
  };

  const handleDownload = async (img) => {
    try {
      const response = await fetch(img.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = img.name;
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    } catch { window.open(img.src, "_blank"); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .gallery-section { font-family: 'Inter', sans-serif; background: #f4f6f8; min-height: 100vh; padding: 28px 28px 60px; color: #2d2d2d; }
        .gallery-header-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .gallery-title-wrap { display: flex; align-items: center; gap: 10px; border-left: 4px solid #1e88e5; padding-left: 12px; }
        .gallery-title { font-size: 1.45rem; font-weight: 700; color: #1a1a1a; margin: 0; letter-spacing: -0.3px; }
        .gallery-count-badge { background: #e8f4fd; color: #1e88e5; font-size: 0.72rem; font-weight: 600; padding: 3px 10px; border-radius: 20px; white-space: nowrap; }
        .btn-upload { display: inline-flex; align-items: center; gap: 6px; background: #1e88e5; color: #fff; border: none; border-radius: 6px; padding: 8px 18px; font-size: 0.82rem; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.18s ease, transform 0.15s ease; white-space: nowrap; }
        .btn-upload:hover:not(:disabled) { background: #1565c0; transform: scale(1.02); }
        .btn-upload:disabled { background: #90caf9; cursor: not-allowed; }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 14px; }
        .gallery-card { background: #fff; border-radius: 6px; overflow: hidden; border: 1px solid #dde1e7; box-shadow: 0 1px 4px rgba(0,0,0,0.06); transition: box-shadow 0.2s ease, transform 0.2s ease; animation: fadeInUp 0.35s ease both; }
        .gallery-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,0.11); transform: translateY(-2px); }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .gallery-img-wrap { position: relative; overflow: hidden; height: 165px; cursor: pointer; background: #eef0f2; }
        .gallery-img-wrap img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.35s ease; }
        .gallery-card:hover .gallery-img-wrap img { transform: scale(1.05); }
        .gallery-img-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0); transition: background 0.25s ease; display: flex; align-items: center; justify-content: center; }
        .gallery-card:hover .gallery-img-overlay { background: rgba(0,0,0,0.15); }
        .zoom-icon { opacity: 0; font-size: 20px; transition: opacity 0.25s ease; }
        .gallery-card:hover .zoom-icon { opacity: 1; }
        .gallery-card-info { padding: 9px 11px 11px; background: #eaf4ea; border-top: 1px solid #d4e8d4; }
        .gallery-card-name { font-size: 0.78rem; font-weight: 500; color: #2e7d32; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .gallery-card-meta { font-size: 0.68rem; color: #777; margin-bottom: 9px; }
        .btn-download { display: inline-flex; align-items: center; gap: 5px; background: #1e88e5; color: #fff; border: none; border-radius: 50px; padding: 5px 13px; font-size: 0.72rem; font-weight: 500; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.18s ease; }
        .btn-download:hover { background: #1565c0; }
        .see-more-wrap { text-align: center; margin-top: 28px; }
        .btn-see-more { background: #fff; color: #1e88e5; border: 1.5px solid #1e88e5; border-radius: 50px; padding: 8px 30px; font-family: 'Inter', sans-serif; font-size: 0.82rem; font-weight: 500; cursor: pointer; transition: background 0.18s ease, color 0.18s ease; display: inline-flex; align-items: center; gap: 6px; }
        .btn-see-more:hover { background: #1e88e5; color: #fff; }
        .lightbox-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.80); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: lbFade 0.2s ease; }
        @keyframes lbFade { from { opacity: 0; } to { opacity: 1; } }
        .lightbox-inner { position: relative; max-width: 820px; width: 100%; }
        .lightbox-inner img { width: 100%; max-height: 82vh; object-fit: contain; border-radius: 8px; display: block; }
        .lightbox-close { position: absolute; top: -12px; right: -12px; background: #1e88e5; color: #fff; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 700; }
        .lightbox-caption { text-align: center; margin-top: 10px; font-size: 0.76rem; color: rgba(255,255,255,0.5); }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── Upload modal ───────────────────────────────────────────────── */
        .upload-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); z-index: 1100; display: flex; align-items: center; justify-content: center; padding: 20px; animation: lbFade 0.18s ease; }
        .upload-modal { background: #fff; border-radius: 10px; padding: 28px 24px 24px; width: 100%; max-width: 420px; box-shadow: 0 12px 40px rgba(0,0,0,0.18); font-family: 'Inter', sans-serif; }
        .upload-modal-title { font-size: 1.05rem; font-weight: 700; color: #1a1a1a; margin: 0 0 4px; }
        .upload-modal-sub { font-size: 0.78rem; color: #888; margin: 0 0 18px; }
        .upload-modal label { display: block; font-size: 0.78rem; font-weight: 600; color: #444; margin-bottom: 6px; }
        .upload-modal textarea { width: 100%; box-sizing: border-box; resize: vertical; border: 1.5px solid #dde1e7; border-radius: 6px; padding: 9px 11px; font-size: 0.82rem; font-family: 'Inter', sans-serif; color: #2d2d2d; background: #fff; -webkit-text-fill-color: #2d2d2d; min-height: 80px; outline: none; transition: border-color 0.18s; }
        .upload-modal textarea:focus { border-color: #1e88e5; }
        .upload-modal-actions { display: flex; gap: 10px; margin-top: 18px; justify-content: flex-end; }
        .btn-modal-cancel { background: #f4f6f8; color: #555; border: 1px solid #dde1e7; border-radius: 6px; padding: 8px 18px; font-size: 0.82rem; font-weight: 500; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.15s; }
        .btn-modal-cancel:hover { background: #e8eaed; }
        .btn-modal-proceed { display: inline-flex; align-items: center; gap: 6px; background: #1e88e5; color: #fff; border: none; border-radius: 6px; padding: 8px 18px; font-size: 0.82rem; font-weight: 600; font-family: 'Inter', sans-serif; cursor: pointer; transition: background 0.18s; }
        .btn-modal-proceed:hover:not(:disabled) { background: #1565c0; }
        .btn-modal-proceed:disabled { background: #90caf9; cursor: not-allowed; }
        /* ─────────────────────────────────────────────────────────────── */
      `}</style>

      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" style={{ display: "none" }} onChange={handleFileChange} />

      <section className="gallery-section">
        <div className="gallery-header-row">
          <div className="gallery-title-wrap">
            <h2 className="gallery-title">Gallery</h2>
            <span className="gallery-count-badge">{allImages.length} Photos</span>
          </div>
          <button className="btn-upload" onClick={handleUploadClick} disabled={uploading}>
            {uploading ? (
              <><span style={{ width: 13, height: 13, border: "2px solid #ffffff60", borderTop: "2px solid #fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.8s linear infinite" }} />Uploading...</>
            ) : (
              <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              {isLoggedIn ? "Upload Photo" : "Login to Upload"}</>
            )}
          </button>
        </div>

        {uploadMsg && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 8, marginBottom: 20, background: uploadMsg.type === "success" ? "#dcfce7" : "#fef2f2", border: `1px solid ${uploadMsg.type === "success" ? "#bbf7d0" : "#fecaca"}`, fontSize: 13, fontWeight: 600, color: uploadMsg.type === "success" ? "#15803d" : "#ef4444" }}>
            {uploadMsg.text}
            <button onClick={() => setUploadMsg(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "inherit", opacity: 0.6 }}>✕</button>
          </div>
        )}

        <div className="gallery-grid">
          {visibleImages.map((img) => (
            <div className="gallery-card" key={img.id}>
              <div className="gallery-img-wrap" onClick={() => setLightbox(img)}>
                <img src={img.src} alt={img.name} loading="lazy" />
                <div className="gallery-img-overlay"><span className="zoom-icon">🔍</span></div>
              </div>
              <div className="gallery-card-info">
                <div className="gallery-card-name">{img.name}</div>
                <div className="gallery-card-meta">Size: {img.size}{img.uploadedBy ? ` · By: ${img.uploadedBy}` : " · Type: FILE"}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn-download" onClick={() => handleDownload(img)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!showAll && allImages.length > INITIAL_VISIBLE && (
          <div className="see-more-wrap">
            <button className="btn-see-more" onClick={() => setShowAll(true)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              See More ({allImages.length - INITIAL_VISIBLE} more)
            </button>
          </div>
        )}
        {showAll && (
          <div className="see-more-wrap">
            <button className="btn-see-more" onClick={() => setShowAll(false)}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              Show Less
            </button>
          </div>
        )}
      </section>

      {/* ── Upload modal ──────────────────────────────────────────────────── */}
      {showUploadModal && (
        <div className="upload-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <p className="upload-modal-title">Upload a Photo</p>
            <p className="upload-modal-sub">Add a short description before selecting your image.</p>
            <label htmlFor="upload-desc">Description <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea
              id="upload-desc"
              placeholder="e.g. Freshers welcome ceremony 2025…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              autoFocus
            />
            <div className="upload-modal-actions">
              <button className="btn-modal-cancel" onClick={() => setShowUploadModal(false)}>Cancel</button>
              <button
                className="btn-modal-proceed"
                onClick={handleModalProceed}
                disabled={!description.trim()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Choose Photo
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
            <img src={lightbox.src} alt={lightbox.name} />
            <p className="lightbox-caption">{lightbox.name} · {lightbox.size}</p>
          </div>
        </div>
      )}
    </>
  );
}