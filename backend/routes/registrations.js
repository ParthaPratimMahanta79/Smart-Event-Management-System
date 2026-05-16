const router = require("express").Router();
const {
  registerForEvent, getMyRegistrations, getCommitteeRegistrations,
  updateRegistrationStatus, getAllRegistrations,
} = require("../controllers/registrationController");
const { protect } = require("../middleware/auth");
const { roles } = require("../middleware/roles");

// ⚠️ Static routes MUST be before /:eventId
router.get("/my",         protect, roles("user"),             getMyRegistrations);
router.get("/committee",  protect, roles("committee"),        getCommitteeRegistrations);
router.get("/admin/all",  protect, roles("admin"),            getAllRegistrations);

router.post("/:eventId",  protect, roles("user"),             registerForEvent);
router.put("/:id/status", protect, roles("committee","admin"),updateRegistrationStatus);

module.exports = router;