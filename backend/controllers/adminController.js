const User = require("../models/User");
const Committee = require("../models/Committee");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const Gallery = require("../models/Gallery");
const bcrypt = require("bcryptjs");

// GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [users, committees, events, registrations, pendingPhotos, pendingRegs] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Committee.countDocuments({ isActive: true }),
      Event.countDocuments(),
      Registration.countDocuments(),
      Gallery.countDocuments({ status: "pending" }),
      Registration.countDocuments({ status: "pending" }),
    ]);
    res.json({ success: true, stats: { users, committees, events, registrations, pendingPhotos, pendingRegs } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ success: false, message: "Cannot delete admin" });
    await user.deleteOne();
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/committees
const getAllCommittees = async (req, res) => {
  try {
    const committees = await Committee.find().populate("userId", "name email").sort({ createdAt: -1 });
    res.json({ success: true, committees });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/committees  — create a new committee + user account
const createCommittee = async (req, res) => {
  try {
    const { name, department, email, password } = req.body;
    if (!name || !department || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = await User.create({ name, email, password: hashedPassword, role: "committee" });
    const committee = await Committee.create({ name, department, email, userId: userDoc._id, isActive: true });

    res.status(201).json({ success: true, message: "Committee created", committee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/committees/:id
const deleteCommittee = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });
    await User.findByIdAndDelete(committee.userId);
    await committee.deleteOne();
    res.json({ success: true, message: "Committee removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/admin/committees/:id/toggle
const toggleCommittee = async (req, res) => {
  try {
    const committee = await Committee.findById(req.params.id);
    if (!committee) return res.status(404).json({ success: false, message: "Committee not found" });
    committee.isActive = !committee.isActive;
    await committee.save();
    res.json({ success: true, message: `Committee ${committee.isActive ? "activated" : "deactivated"}`, committee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("organizer", "name department").sort({ date: 1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/events/:id  — admin deletes any event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    await event.deleteOne();
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/gallery  — all approved photos
const getAdminGallery = async (req, res) => {
  try {
    const photos = await Gallery.find({ status: "approved" })
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, photos });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/admin/gallery/upload  — admin uploads directly to gallery (auto-approved)
const uploadAdminPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image provided" });
    const photo = await Gallery.create({
      title: req.body.title || "",
      image: `/uploads/gallery/${req.file.filename}`,
      uploadedBy: req.user._id,
      status: "approved",
      approvedBy: req.user._id,
    });
    const populated = await photo.populate("uploadedBy", "name email");
    res.status(201).json({ success: true, message: "Photo uploaded to gallery", photo: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/gallery/:id
const deleteGalleryPhoto = async (req, res) => {
  try {
    const photo = await Gallery.findById(req.params.id);
    if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });
    await photo.deleteOne();
    res.json({ success: true, message: "Photo deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getDashboard, getAllUsers, deleteUser,
  getAllCommittees, createCommittee, deleteCommittee, toggleCommittee,
  getAllEvents, deleteEvent,
  getAdminGallery, uploadAdminPhoto, deleteGalleryPhoto,
};