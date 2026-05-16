const Registration = require("../models/Registration");
const Committee = require("../models/Committee");

// POST /api/registrations/:eventId
// eventId is the frontend static ID (e.g. "101", "1") — NOT a MongoDB ObjectId
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { committeeName, eventTitle } = req.body;

    if (!committeeName) {
      return res.status(400).json({ success: false, message: "committeeName is required" });
    }

    // Resolve committee from DB by name
    const committee = await Committee.findOne({ name: committeeName });
    if (!committee) {
      return res.status(404).json({ success: false, message: `Committee "${committeeName}" not found` });
    }

    // Duplicate check — using string eventId, not ObjectId
    const existing = await Registration.findOne({ user: req.user._id, eventId: String(eventId) });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already registered for this event" });
    }

    const registration = await Registration.create({
      user:       req.user._id,
      eventId:    String(eventId),
      eventTitle: eventTitle || "",
      committee:  committee._id,
      status:     "approved",
    });

    res.status(201).json({ success: true, message: "Successfully registered.", registration });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations/my
const getMyRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find({ user: req.user._id })
      .populate("committee", "name department")
      .sort({ createdAt: -1 });
    res.json({ success: true, registrations: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations/committee — committee sees registrations for their events only
const getCommitteeRegistrations = async (req, res) => {
  try {
    const committee = await Committee.findOne({ userId: req.user._id });
    if (!committee) return res.status(403).json({ success: false, message: "Committee not found" });

    const regs = await Registration.find({ committee: committee._id })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json({ success: true, registrations: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/registrations/:id/status
const updateRegistrationStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ success: false, message: "Status must be approved or rejected" });

    const reg = await Registration.findById(req.params.id).populate("committee");
    if (!reg) return res.status(404).json({ success: false, message: "Registration not found" });

    const committee = await Committee.findOne({ userId: req.user._id });
    const isOwner = committee && String(reg.committee._id) === String(committee._id);
    if (!isOwner && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    reg.status = status;
    reg.note = note || "";
    await reg.save();

    res.json({ success: true, message: `Registration ${status}`, registration: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/registrations/admin/all
const getAllRegistrations = async (req, res) => {
  try {
    const regs = await Registration.find()
      .populate("user", "name email")
      .populate("committee", "name department")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: regs.length, registrations: regs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getCommitteeRegistrations,
  updateRegistrationStatus,
  getAllRegistrations,
};