const Event = require("../models/Event");
const Committee = require("../models/Committee");

// Auto-compute status from date
const computeStatus = (date) => {
  const now  = new Date();
  const evtDate = new Date(date);
  const dayStart = new Date(evtDate); dayStart.setHours(0, 0, 0, 0);
  const dayEnd   = new Date(evtDate); dayEnd.setHours(23, 59, 59, 999);
  if (now < dayStart) return "upcoming";
  if (now >= dayStart && now <= dayEnd) return "ongoing";
  return "completed";
};

// GET /api/events  (public)
const getEvents = async (req, res) => {
  try {
    const { category, status, search } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (status)   filter.status   = status;
    if (search)   filter.title    = { $regex: search, $options: "i" };

    const events = await Event.find(filter)
      .populate("organizer", "name department")
      .populate("createdBy", "name")
      .sort({ date: 1 });

    // Auto-update status for each event
    const updated = await Promise.all(events.map(async (e) => {
      const computed = computeStatus(e.date);
      if (computed !== e.status) {
        e.status = computed;
        await e.save();
      }
      return e;
    }));

    res.json({ success: true, count: updated.length, events: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id  (public)
const getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name department email")
      .populate("createdBy", "name");
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events  (committee only)
const createEvent = async (req, res) => {
  try {
    const committee = await Committee.findOne({ userId: req.user._id });
    if (!committee) return res.status(403).json({ success: false, message: "Only committee members can create events" });

    const { title, description, category, date, time, venue, maxCapacity, registrationDeadline } = req.body;
    const image = req.file ? `/uploads/events/${req.file.filename}` : "";

    const status = computeStatus(date);

    const event = await Event.create({
      title, description, category, date, time, venue,
      maxCapacity: maxCapacity || 100,
      registrationDeadline,
      image,
      status,
      organizer:  committee._id,
      createdBy:  req.user._id,
    });

    const populated = await event.populate("organizer", "name department");
    res.status(201).json({ success: true, message: "Event created", event: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/events/:id
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (String(event.createdBy) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    if (req.body.date) req.body.status = computeStatus(req.body.date);

    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: "Event updated", event: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/events/:id
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (String(event.createdBy) !== String(req.user._id) && req.user.role !== "admin")
      return res.status(403).json({ success: false, message: "Not authorised" });

    await event.deleteOne();
    res.json({ success: true, message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/committee/mine
const getMyEvents = async (req, res) => {
  try {
    const committee = await Committee.findOne({ userId: req.user._id });
    if (!committee) return res.status(403).json({ success: false, message: "Committee not found" });
    const events = await Event.find({ organizer: committee._id }).sort({ date: -1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getMyEvents };