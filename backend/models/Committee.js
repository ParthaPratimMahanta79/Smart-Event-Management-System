const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, default: "Member" },
  department: { type: String, default: "" },
  phone:      { type: String, default: "" },
}, { _id: true });

const committeeSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true },
    email:      { type: String, required: true, unique: true },
    department: { type: String, default: "" },
    userId:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isActive:   { type: Boolean, default: true },
    members:    { type: [memberSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Committee", committeeSchema);