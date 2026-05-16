const router = require("express").Router();
const { uploadPhoto, getApprovedPhotos, getPendingPhotos, updatePhotoStatus, deletePhoto } = require("../controllers/galleryController");
const { protect } = require("../middleware/auth");
const { roles } = require("../middleware/roles");
const { uploadGallery } = require("../middleware/upload");

router.get("/",              getApprovedPhotos);                                   // public
router.post("/upload",       protect, uploadGallery.single("image"), uploadPhoto); // any logged-in user
router.get("/pending",       protect, roles("admin"), getPendingPhotos);           // admin
router.put("/:id/status",    protect, roles("admin"), updatePhotoStatus);          // admin
router.delete("/:id",        protect, roles("admin"), deletePhoto);                // admin

module.exports = router;