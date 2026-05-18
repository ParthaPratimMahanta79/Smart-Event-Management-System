const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category:    { type: String, enum: ["Science","Technology","Art","Music","Sports","Business","Other"], required: true },
    date:        { type: Date, required: true },
    time:        { type: String, required: true },
    venue:       { type: String, required: true },
    image:       { type: String, default: "" },
    maxCapacity: { type: Number, default: 100 },
    status:      { type: String, enum: ["upcoming","ongoing","completed","cancelled"], default: "upcoming" },
    organizer:   { type: mongoose.Schema.Types.ObjectId, ref: "Committee", required: true },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    registrationDeadline: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);