const Registration = require("../models/Registration");
const Event = require("../models/Event");
const Committee = require("../models/Committee");

// POST /api/registrations/:eventId  — user registers for an event
const registerForEvent = async (req, res) => {
  const event = await Event.findById(req.params.eventId).populate("organizer");
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  const existing = await Registration.findOne({ user: req.user._id, event: event._id });
  if (existing) return res.status(400).json({ success: false, message: "Already registered for this event" });

  const registration = await Registration.create({
    user: req.user._id,
    event: event._id,
    committee: event.organizer._id,
    status: "pending",
  });

  res.status(201).json({ success: true, message: "Registration request sent. Awaiting committee approval.", registration });
};

// GET /api/registrations/my  — user sees their own registrations
const getMyRegistrations = async (req, res) => {
  const regs = await Registration.find({ user: req.user._id })
    .populate("event", "title date venue category image")
    .populate("committee", "name department")
    .sort({ createdAt: -1 });
  res.json({ success: true, registrations: regs });
};

// GET /api/registrations/committee  — committee sees pending requests for their events
const getCommitteeRegistrations = async (req, res) => {
  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(403).json({ success: false, message: "Committee not found" });

  const regs = await Registration.find({ committee: committee._id })
    .populate("user", "name email phone department")
    .populate("event", "title date venue")
    .sort({ createdAt: -1 });

  res.json({ success: true, registrations: regs });
};

// PUT /api/registrations/:id/approve  — committee approves or rejects
const updateRegistrationStatus = async (req, res) => {
  const { status, note } = req.body; // status: "approved" | "rejected"
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ success: false, message: "Status must be approved or rejected" });

  const reg = await Registration.findById(req.params.id).populate("committee");
  if (!reg) return res.status(404).json({ success: false, message: "Registration not found" });

  // Only the committee that owns the event, or admin, can update
  const committee = await Committee.findOne({ userId: req.user._id });
  const isOwner = committee && String(reg.committee._id) === String(committee._id);
  if (!isOwner && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorised" });

  reg.status = status;
  reg.note = note || "";
  await reg.save();

  res.json({ success: true, message: `Registration ${status}`, registration: reg });
};

// GET /api/registrations/admin/all  — admin sees all registrations
const getAllRegistrations = async (req, res) => {
  const regs = await Registration.find()
    .populate("user", "name email")
    .populate("event", "title date")
    .populate("committee", "name department")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: regs.length, registrations: regs });
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getCommitteeRegistrations,
  updateRegistrationStatus,
  getAllRegistrations,
};