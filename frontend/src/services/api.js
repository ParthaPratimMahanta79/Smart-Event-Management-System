const BASE = "http://localhost:5001/api";

const getToken = () => localStorage.getItem("sem_token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const jsonHeaders = () => ({
  "Content-Type": "application/json",
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) =>
  fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const loginUser = (data) =>
  fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: jsonHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMe = () =>
  fetch(`${BASE}/auth/me`, { headers: authHeaders() }).then((r) => r.json());

// ── Events ────────────────────────────────────────────────────────────────────
export const getEvents = (query = "") =>
  fetch(`${BASE}/events${query}`).then((r) => r.json());

export const getEvent = (id) =>
  fetch(`${BASE}/events/${id}`).then((r) => r.json());

// ── Registrations ─────────────────────────────────────────────────────────────
export const registerForEvent = (eventId, data) =>
  fetch(`${BASE}/registrations/${eventId}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMyRegistrations = () =>
  fetch(`${BASE}/registrations/my`, { headers: authHeaders() }).then((r) => r.json());

// ── Gallery ───────────────────────────────────────────────────────────────────
export const getGallery = () =>
  fetch(`${BASE}/gallery`).then((r) => r.json());

export const uploadPhoto = (formData) =>
  fetch(`${BASE}/gallery/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` }, // no Content-Type for FormData
    body: formData,
  }).then((r) => r.json());

// ── Committee ─────────────────────────────────────────────────────────────────
export const getCommittees = () =>
  fetch(`${BASE}/committee/list`).then((r) => r.json());

export const getCommitteeDashboard = () =>
  fetch(`${BASE}/committee/dashboard`, { headers: authHeaders() }).then((r) => r.json());

export const getCommitteeRegistrations = (query = "") =>
  fetch(`${BASE}/committee/registrations${query}`, { headers: authHeaders() }).then((r) => r.json());

export const updateRegistrationStatus = (id, status, note = "") =>
  fetch(`${BASE}/committee/registrations/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status, note }),
  }).then((r) => r.json());

export const getCommitteeEvents = () =>
  fetch(`${BASE}/committee/events`, { headers: authHeaders() }).then((r) => r.json());

export const createEvent = (formData) =>
  fetch(`${BASE}/events`, {
    method: "POST",
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  }).then((r) => r.json());

// ── Admin ─────────────────────────────────────────────────────────────────────
export const getAdminDashboard = () =>
  fetch(`${BASE}/admin/dashboard`, { headers: authHeaders() }).then((r) => r.json());

export const getAdminUsers = () =>
  fetch(`${BASE}/admin/users`, { headers: authHeaders() }).then((r) => r.json());

export const deleteUser = (id) =>
  fetch(`${BASE}/admin/users/${id}`, { method: "DELETE", headers: authHeaders() }).then((r) => r.json());

export const getAdminCommittees = () =>
  fetch(`${BASE}/admin/committees`, { headers: authHeaders() }).then((r) => r.json());

export const deleteCommittee = (id) =>
  fetch(`${BASE}/admin/committees/${id}`, { method: "DELETE", headers: authHeaders() }).then((r) => r.json());

export const toggleCommittee = (id) =>
  fetch(`${BASE}/admin/committees/${id}/toggle`, { method: "PUT", headers: authHeaders() }).then((r) => r.json());

export const getAdminEvents = () =>
  fetch(`${BASE}/admin/events`, { headers: authHeaders() }).then((r) => r.json());

export const getAllRegistrations = () =>
  fetch(`${BASE}/registrations/admin/all`, { headers: authHeaders() }).then((r) => r.json());

export const getPendingPhotos = () =>
  fetch(`${BASE}/gallery/pending`, { headers: authHeaders() }).then((r) => r.json());

export const updatePhotoStatus = (id, status) =>
  fetch(`${BASE}/gallery/${id}/status`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  }).then((r) => r.json());