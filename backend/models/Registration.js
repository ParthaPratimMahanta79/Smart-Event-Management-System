const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user:       { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // eventId is the frontend static ID (e.g. "101", "1") — not a MongoDB ObjectId
    eventId:    { type: String, required: true },
    eventTitle: { type: String, default: "" },
    committee:  { type: mongoose.Schema.Types.ObjectId, ref: "Committee", required: true },
    status:     { type: String, enum: ["pending", "approved", "rejected"], default: "approved" },
    note:       { type: String, default: "" },
  },
  { timestamps: true }
);

// One registration per user per event
registrationSchema.index({ user: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);