const Gallery = require("../models/Gallery");

// POST /api/gallery/upload  — logged-in user uploads a photo (goes to pending)
const uploadPhoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: "No image file provided" });

  const photo = await Gallery.create({
    title: req.body.title || "",
    image: `/uploads/gallery/${req.file.filename}`,
    uploadedBy: req.user._id,
    event: req.body.eventId || null,
    status: "pending",
  });

  res.status(201).json({ success: true, message: "Photo uploaded. Awaiting admin approval.", photo });
};

// GET /api/gallery  — public: only approved photos
const getApprovedPhotos = async (req, res) => {
  const photos = await Gallery.find({ status: "approved" })
    .populate("uploadedBy", "name")
    .populate("event", "title")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: photos.length, photos });
};

// GET /api/gallery/pending  — admin: all pending photos
const getPendingPhotos = async (req, res) => {
  const photos = await Gallery.find({ status: "pending" })
    .populate("uploadedBy", "name email")
    .populate("event", "title")
    .sort({ createdAt: -1 });
  res.json({ success: true, photos });
};

// PUT /api/gallery/:id/approve  — admin approves or rejects
const updatePhotoStatus = async (req, res) => {
  const { status } = req.body; // "approved" | "rejected"
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ success: false, message: "Status must be approved or rejected" });

  const photo = await Gallery.findByIdAndUpdate(
    req.params.id,
    { status, approvedBy: req.user._id },
    { new: true }
  );
  if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });

  res.json({ success: true, message: `Photo ${status}`, photo });
};

// DELETE /api/gallery/:id  — admin deletes
const deletePhoto = async (req, res) => {
  const photo = await Gallery.findById(req.params.id);
  if (!photo) return res.status(404).json({ success: false, message: "Photo not found" });
  await photo.deleteOne();
  res.json({ success: true, message: "Photo deleted" });
};

module.exports = { uploadPhoto, getApprovedPhotos, getPendingPhotos, updatePhotoStatus, deletePhoto };