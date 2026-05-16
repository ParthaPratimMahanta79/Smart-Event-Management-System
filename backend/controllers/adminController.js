const User = require("../models/User");
const Committee = require("../models/Committee");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Gallery = require("../models/Gallery");

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  const [users, committees, events, registrations, pendingPhotos, pendingRegs] = await Promise.all([
    User.countDocuments({ role: "user" }),
    Committee.countDocuments({ isActive: true }),
    Event.countDocuments(),
    Registration.countDocuments(),
    Gallery.countDocuments({ status: "pending" }),
    Registration.countDocuments({ status: "pending" }),
  ]);
  res.json({ success: true, stats: { users, committees, events, registrations, pendingPhotos, pendingRegs } });
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
  res.json({ success: true, users });
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  if (user.role === "admin") return res.status(400).json({ success: false, message: "Cannot delete admin" });
  await user.deleteOne();
  res.json({ success: true, message: "User deleted" });
};

// GET /api/admin/committees
const getAllCommittees = async (req, res) => {
  const committees = await Committee.find().populate("userId", "name email").sort({ createdAt: -1 });
  res.json({ success: true, committees });
};

// DELETE /api/admin/committees/:id  — remove committee + their user account
const deleteCommittee = async (req, res) => {
  const committee = await Committee.findById(req.params.id);
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });
  await User.findByIdAndDelete(committee.userId);
  await committee.deleteOne();
  res.json({ success: true, message: "Committee removed" });
};

// PUT /api/admin/committees/:id/toggle  — activate / deactivate
const toggleCommittee = async (req, res) => {
  const committee = await Committee.findById(req.params.id);
  if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });
  committee.isActive = !committee.isActive;
  await committee.save();
  res.json({ success: true, message: `Committee ${committee.isActive ? "activated" : "deactivated"}`, committee });
};

// GET /api/admin/events  — all events with organizer info
const getAllEvents = async (req, res) => {
  const events = await Event.find().populate("organizer", "name department").sort({ date: 1 });
  res.json({ success: true, events });
};

module.exports = { getDashboard, getAllUsers, deleteUser, getAllCommittees, deleteCommittee, toggleCommittee, getAllEvents };