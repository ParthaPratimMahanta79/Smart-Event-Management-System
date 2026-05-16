const router = require("express").Router();
const { getDashboard, getAllUsers, deleteUser, getAllCommittees, deleteCommittee, toggleCommittee, getAllEvents } = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { roles } = require("../middleware/roles");

router.use(protect, roles("admin")); // all admin routes protected

router.get("/dashboard",           getDashboard);
router.get("/users",               getAllUsers);
router.delete("/users/:id",        deleteUser);
router.get("/committees",          getAllCommittees);
router.delete("/committees/:id",   deleteCommittee);
router.put("/committees/:id/toggle", toggleCommittee);
router.get("/events",              getAllEvents);

module.exports = router;