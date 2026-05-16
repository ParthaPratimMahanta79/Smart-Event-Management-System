const router = require("express").Router();
const {
  registerForEvent, getMyRegistrations, getCommitteeRegistrations,
  updateRegistrationStatus, getAllRegistrations,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/auth");
const { roles } = require("../middleware/roles");

router.post("/:eventId",         protect, roles("user"), registerForEvent);
router.get("/my",                protect, roles("user"), getMyRegistrations);
router.get("/committee",         protect, roles("committee"), getCommitteeRegistrations);
router.put("/:id/status",        protect, roles("committee","admin"), updateRegistrationStatus);
router.get("/admin/all",         protect, roles("admin"), getAllRegistrations);

module.exports = router;