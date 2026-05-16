// Run this once to seed Admin and Committee accounts into DB
// Usage: node config/seed.js

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const User = require("../models/User");
const Committee = require("../models/Committee");

const seed = async () => {
  await connectDB();

  // Clear existing admin/committee
  await User.deleteMany({ role: "admin" });
  await User.deleteMany({ role: "committee" });
  await Committee.deleteMany({});

  const salt = await bcrypt.genSalt(10);

  // ── Seed Admin ──────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", salt);
  await User.create({
    name: "Super Admin",
    email: "admin@smartevent.com",
    password: adminPassword,
    role: "admin",
    isApproved: true,
  });
  console.log("✅ Admin created → email: admin@smartevent.com | password: admin123");

  // ── Seed Committees ─────────────────────────────────────────────────────────
  // Names here MUST exactly match the committee field values in eventsData.js
  const committees = [
    { name: "Sports Committee",   email: "sports@smartevent.com",   password: "sports123",   department: "Sports & Athletics" },
    { name: "Coding Committee",   email: "coding@smartevent.com",   password: "coding123",   department: "Computer Science" },
    { name: "Robotics Club",      email: "robotics@smartevent.com", password: "robotics123", department: "Robotics & Automation" },
    { name: "Cultural Committee", email: "cultural@smartevent.com", password: "cultural123", department: "Cultural Activities" },
    { name: "Media Committee",    email: "media@smartevent.com",    password: "media123",    department: "Media & Photography" },
    { name: "NSS Committee",      email: "nss@smartevent.com",      password: "nss123",      department: "Social Service" },
    { name: "Art Committee",      email: "art@smartevent.com",      password: "art123",      department: "Fine Arts" },
  ];

  for (const c of committees) {
    const hash = await bcrypt.hash(c.password, salt);
    const user = await User.create({
      name: c.name,
      email: c.email,
      password: hash,
      role: "committee",
      isApproved: true,
    });
    await Committee.create({
      name: c.name,
      email: c.email,
      department: c.department,
      userId: user._id,
    });
    console.log(`✅ Committee → email: ${c.email} | password: ${c.password}`);
  }

  console.log("\n🎉 Seeding complete!");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});