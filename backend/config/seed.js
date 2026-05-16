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
  await Committee.deleteMany({});

  const salt = await bcrypt.genSalt(10);

  // ── Seed Admin ──────────────────────────────
  const adminPassword = await bcrypt.hash("admin123", salt);
  await User.create({
    name: "Super Admin",
    email: "admin@smartevent.com",
    password: adminPassword,
    role: "admin",
    isApproved: true,
  });
  console.log("✅ Admin created → email: admin@smartevent.com | password: admin123");

  // ── Seed Committees ─────────────────────────
  const committees = [
    { name: "CSE Department",     email: "cse@smartevent.com",     password: "cse123",     department: "Computer Science" },
    { name: "Cultural Club",      email: "cultural@smartevent.com", password: "cultural123", department: "Cultural Activities" },
    { name: "Sports Committee",   email: "sports@smartevent.com",   password: "sports123",   department: "Sports & Athletics" },
    { name: "Research Cell",      email: "research@smartevent.com", password: "research123", department: "Research & Innovation" },
  ];

  for (const c of committees) {
    const hash = await bcrypt.hash(c.password, salt);
    // Create committee login via User model with role='committee'
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
    console.log(`✅ Committee created → email: ${c.email} | password: ${c.password}`);
  }

  console.log("\n🎉 Seeding complete! Do NOT expose these credentials publicly.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});