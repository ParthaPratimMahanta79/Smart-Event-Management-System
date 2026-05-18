const router = require("express").Router();
const {
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
} = require("../controllers/committeeController");
const { protect }     = require("../middleware/auth");
const { roles }       = require("../middleware/roles");

// Public
router.get("/list", getCommitteeList);

// Committee protected
router.get("/dashboard",         protect, roles("committee"), getDashboard);
router.get("/profile",           protect, roles("committee"), getProfile);
router.put("/profile",           protect, roles("committee"), updateProfile);
router.get("/events",            protect, roles("committee"), getMyEvents);
router.get("/registrations",     protect, roles("committee"), getRegistrations);
router.put("/registrations/:id", protect, roles("committee"), updateRegistration);

// Member management
router.get("/members",              protect, roles("committee"), getMembers);
router.post("/members",             protect, roles("committee"), addMember);
router.delete("/members/:memberId", protect, roles("committee"), removeMember);

module.exports = router;