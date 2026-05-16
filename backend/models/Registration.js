const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    user:      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event:     { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    committee: { type: mongoose.Schema.Types.ObjectId, ref: "Committee", required: true },
    status:    { type: String, enum: ["pending","approved","rejected"], default: "pending" },
    note:      { type: String, default: "" }, // optional note from committee
  },
  { timestamps: true }
);

// One registration per user per event
registrationSchema.index({ user: 1, event: 1 }, { unique: true });

module.exports = mongoose.model("Registration", registrationSchema);