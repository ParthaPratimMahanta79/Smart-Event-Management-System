const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, unique: true, lowercase: true },
    password:   { type: String, required: true },
    role:       { type: String, enum: ["user", "committee", "admin"], default: "user" },
    isApproved: { type: Boolean, default: false }, // admin/committee pre-approved; users approved on register
    profilePic: { type: String, default: "" },
    phone:      { type: String, default: "" },
    department: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);