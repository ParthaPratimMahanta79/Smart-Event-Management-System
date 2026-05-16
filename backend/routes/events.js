const router = require("express").Router();
const { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getMyEvents } = require("../controllers/eventController");
const { protect } = require("../middleware/auth");
const { roles } = require("../middleware/roles");
const { uploadEvent } = require("../middleware/upload");

router.get("/",               getEvents);                                       // public
router.get("/committee/mine", protect, roles("committee"), getMyEvents);        // committee only
router.get("/:id",            getEvent);                                        // public
router.post("/",              protect, roles("committee"), uploadEvent.single("image"), createEvent);
router.put("/:id",            protect, roles("committee","admin"), updateEvent);
router.delete("/:id",         protect, roles("committee","admin"), deleteEvent);

module.exports = router;