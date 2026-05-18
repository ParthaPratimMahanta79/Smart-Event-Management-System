const Committee = require("../models/Committee");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");

// ── helpers ───────────────────────────────────────────────────────────────────
const getCommittee = async (userId) => Committee.findOne({ userId });

// GET /api/committee/dashboard
const getDashboard = async (req, res) => {
  try {
    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

    const [totalEvents, upcomingEvents, totalRegistrations] = await Promise.all([
      Event.countDocuments({ organizer: committee._id }),
      Event.countDocuments({ organizer: committee._id, status: { $in: ["upcoming", "ongoing"] } }),
      Registration.countDocuments({ committee: committee._id }),
    ]);

    res.json({
      success: true,
      committee,
      stats: { totalEvents, upcomingEvents, totalRegistrations, totalMembers: committee.members.length },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/committee/profile
const getProfile = async (req, res) => {
  try {
    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });
    res.json({ success: true, committee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/committee/profile
const updateProfile = async (req, res) => {
  try {
    const { name, department, phone } = req.body;
    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

    if (name)       committee.name       = name;
    if (department) committee.department = department;
    await committee.save();
    await User.findByIdAndUpdate(req.user._id, {
      ...(name  && { name }),
      ...(phone && { phone }),
    });

    res.json({ success: true, message: "Profile updated", committee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/committee/events
const getMyEvents = async (req, res) => {
  try {
    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

    const events = await Event.find({ organizer: committee._id }).sort({ date: -1 });
    res.json({ success: true, count: events.length, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/committee/registrations
const getRegistrations = async (req, res) => {
  try {
    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

    const { status, eventId } = req.query;
    const filter = { committee: committee._id };
    if (status)  filter.status  = status;
    if (eventId) filter.eventId = eventId;

    const registrations = await Registration.find(filter)
      .populate("user", "name email phone department")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/committee/registrations/:id
const updateRegistration = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ success: false, message: "Status must be approved or rejected" });

    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ success: false, message: "Registration not found" });

    if (String(reg.committee) !== String(committee._id))
      return res.status(403).json({ success: false, message: "Not authorised" });

    reg.status = status;
    reg.note   = note || "";
    await reg.save();

    res.json({ success: true, message: `Registration ${status}`, registration: reg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/committee/list  (public)
const getCommitteeList = async (req, res) => {
  try {
    const committees = await Committee.find({ isActive: true }).select("name department email");
    res.json({ success: true, committees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── Member management ─────────────────────────────────────────────────────────

// POST /api/committee/members  — add a member
const addMember = async (req, res) => {
  try {
    const { name, role, department, phone } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Member name is required" });

    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

    committee.members.push({ name, role: role || "Member", department: department || "", phone: phone || "" });
    await committee.save();

    res.status(201).json({ success: true, message: "Member added", members: committee.members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/committee/members/:memberId  — remove a member
const removeMember = async (req, res) => {
  try {
    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

    committee.members = committee.members.filter(
      (m) => String(m._id) !== String(req.params.memberId)
    );
    await committee.save();

    res.json({ success: true, message: "Member removed", members: committee.members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/committee/members  — list members
const getMembers = async (req, res) => {
  try {
    const committee = await getCommittee(req.user._id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });
    res.json({ success: true, members: committee.members });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getMyEvents,
  getRegistrations,
  updateRegistration,
  getCommitteeList,
  addMember,
  removeMember,
  getMembers,
};