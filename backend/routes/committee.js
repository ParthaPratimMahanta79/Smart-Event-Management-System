const router = require("express").Router();
const {
  getDashboard,
  getProfile,
  updateProfile,
  getMyEvents,
  getRegistrations,
  updateRegistration,
  getCommitteeList,
} = require("../controllers/committeeController");
const { protect } = require("../middleware/auth");
const { roles }   = require("../middleware/roles");

router.get("/list",              getCommitteeList);
router.get("/dashboard",         protect, roles("committee"), getDashboard);
router.get("/profile",           protect, roles("committee"), getProfile);
router.put("/profile",           protect, roles("committee"), updateProfile);
router.get("/events",            protect, roles("committee"), getMyEvents);
router.get("/registrations",     protect, roles("committee"), getRegistrations);
router.put("/registrations/:id", protect, roles("committee"), updateRegistration);

module.exports = router;