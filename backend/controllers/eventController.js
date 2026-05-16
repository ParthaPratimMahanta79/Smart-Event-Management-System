const Event = require("../models/Event");
const Committee = require("../models/Committee");

// GET /api/events  (public)
const getEvents = async (req, res) => {
  const { category, status, search } = req.query;
  const filter = {};
  if (category) filter.category = category;
  if (status)   filter.status   = status;
  if (search)   filter.title    = { $regex: search, $options: "i" };

  const events = await Event.find(filter)
    .populate("organizer", "name department")
    .populate("createdBy", "name")
    .sort({ date: 1 });

  res.json({ success: true, count: events.length, events });
};

// GET /api/events/:id  (public)
const getEvent = async (req, res) => {
  const event = await Event.findById(req.params.id)
    .populate("organizer", "name department email")
    .populate("createdBy", "name");
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });
  res.json({ success: true, event });
};

// POST /api/events  (committee only)
const createEvent = async (req, res) => {
  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(403).json({ success: false, message: "Only committee members can create events" });

  const { title, description, category, date, time, venue, maxCapacity, registrationDeadline } = req.body;
  const image = req.file ? `/uploads/events/${req.file.filename}` : "";

  const event = await Event.create({
    title, description, category, date, time, venue, maxCapacity,
    registrationDeadline, image,
    organizer: committee._id,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, message: "Event created", event });
};

// PUT /api/events/:id  (committee who created it)
const updateEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  if (String(event.createdBy) !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorised to update this event" });

  const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, message: "Event updated", event: updated });
};

// DELETE /api/events/:id  (admin or committee who created it)
const deleteEvent = async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ success: false, message: "Event not found" });

  if (String(event.createdBy) !== String(req.user._id) && req.user.role !== "admin")
    return res.status(403).json({ success: false, message: "Not authorised to delete this event" });

  await event.deleteOne();
  res.json({ success: true, message: "Event deleted" });
};

// GET /api/events/committee/mine  (committee sees their own events)
const getMyEvents = async (req, res) => {
  const committee = await Committee.findOne({ userId: req.user._id });
  if (!committee) return res.status(403).json({ success: false, message: "Committee not found" });

  const events = await Event.find({ organizer: committee._id }).sort({ date: 1 });
  res.json({ success: true, events });
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getMyEvents };