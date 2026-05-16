const Committee = require("../models/Committee");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET /api/committee/dashboard — committee sees their own stats
const getDashboard = async (req, res) => {
  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

  const [totalEvents, upcomingEvents, totalRegistrations, pendingRegistrations] = await Promise.all([
    Event.countDocuments({ organizer: committee._id }),
    Event.countDocuments({ organizer: committee._id, status: "upcoming" }),
    Registration.countDocuments({ committee: committee._id }),
    Registration.countDocuments({ committee: committee._id, status: "pending" }),
  ]);

  res.json({
    success: true,
    committee,
    stats: { totalEvents, upcomingEvents, totalRegistrations, pendingRegistrations },
  });
};

// GET /api/committee/profile — committee sees their own profile
const getProfile = async (req, res) => {
  const committee = await Committee.findOne({ userId: req.user._id }).populate("userId", "name email phone");
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });
  res.json({ success: true, committee });
};

// PUT /api/committee/profile — committee updates their profile
const updateProfile = async (req, res) => {
  const { name, department, phone } = req.body;

  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

  if (name)       committee.name       = name;
  if (department) committee.department = department;
  await committee.save();

  // Also update name/phone in User model
  await User.findByIdAndUpdate(req.user._id, {
    ...(name  && { name }),
    ...(phone && { phone }),
  });

  res.json({ success: true, message: "Profile updated", committee });
};

// GET /api/committee/events — all events by this committee
const getMyEvents = async (req, res) => {
  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

  const events = await Event.find({ organizer: committee._id }).sort({ date: 1 });
  res.json({ success: true, count: events.length, events });
};

// GET /api/committee/registrations — all registrations for this committee's events
const getRegistrations = async (req, res) => {
  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

  const { status, eventId } = req.query;
  const filter = { committee: committee._id };
  if (status)  filter.status = status;
  if (eventId) filter.event  = eventId;

  const registrations = await Registration.find(filter)
    .populate("user",  "name email phone department")
    .populate("event", "title date venue category")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: registrations.length, registrations });
};

// PUT /api/committee/registrations/:id — approve or reject a registration
const updateRegistration = async (req, res) => {
  const { status, note } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ success: false, message: "Status must be 'approved' or 'rejected'" });

  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });

  const reg = await Registration.findById(req.params.id);
  if (!reg) return res.status(404).json({ success: false, message: "Registration not found" });

  // Make sure this registration belongs to this committee
  if (String(reg.committee) !== String(committee._id))
    return res.status(403).json({ success: false, message: "Not authorised to update this registration" });

  reg.status = status;
  reg.note   = note || "";
  await reg.save();

  const populated = await reg.populate([
    { path: "user",  select: "name email" },
    { path: "event", select: "title date" },
  ]);

  res.json({ success: true, message: `Registration ${status}`, registration: populated });
};

// GET /api/committee/list — public list of all active committees (no auth needed)
const getCommitteeList = async (req, res) => {
  const committees = await Committee.find({ isActive: true }).select("name department email");
  res.json({ success: true, committees });
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getMyEvents,
  getRegistrations,
  updateRegistration,
  getCommitteeList,
};