const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    title:      { type: String, default: "" },
    image:      { type: String, required: true }, // file path from multer
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event:      { type: mongoose.Schema.Types.ObjectId, ref: "Event" }, // optional link
    status:     { type: String, enum: ["pending","approved","rejected"], default: "pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);