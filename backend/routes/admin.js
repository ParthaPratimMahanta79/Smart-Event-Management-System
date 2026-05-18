const router = require("express").Router();
const {
  getDashboard, getAllUsers, deleteUser,
  getAllCommittees, createCommittee, deleteCommittee, toggleCommittee,
  getAllEvents, deleteEvent,
  getAdminGallery, uploadAdminPhoto, deleteGalleryPhoto,
} = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { roles } = require("../middleware/roles");
const { uploadGallery } = require("../middleware/upload");

router.use(protect, roles("admin"));

router.get("/dashboard",              getDashboard);
router.get("/users",                  getAllUsers);
router.delete("/users/:id",           deleteUser);
router.get("/committees",             getAllCommittees);
router.post("/committees",            createCommittee);
router.delete("/committees/:id",      deleteCommittee);
router.put("/committees/:id/toggle",  toggleCommittee);
router.get("/events",                 getAllEvents);
router.delete("/events/:id",          deleteEvent);
router.get("/gallery",                getAdminGallery);
router.post("/gallery/upload",        uploadGallery.single("image"), uploadAdminPhoto);
router.delete("/gallery/:id",         deleteGalleryPhoto);

module.exports = router;