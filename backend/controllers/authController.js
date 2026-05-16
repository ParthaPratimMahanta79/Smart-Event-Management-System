const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Committee = require("../models/Committee");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register  (users only)
const register = async (req, res) => {
  const { name, email, password, phone, department } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: "Name, email and password are required" });

  if (await User.findOne({ email }))
    return res.status(400).json({ success: false, message: "Email already registered" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  const user = await User.create({
    name, email, password: hashed, phone, department,
    role: "user", isApproved: true, // users auto-approved on register
  });

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    token: generateToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
};

// POST /api/auth/login  (all roles)
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password are required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

  // Attach committee info if role is committee
  let committeeId = null;
  if (user.role === "committee") {
    const comm = await Committee.findOne({ userId: user._id });
    committeeId = comm?._id || null;
  }

  res.json({
    success: true,
    token: generateToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      committeeId,
    },
  });
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json({ success: true, user });
};

module.exports = { register, login, getMe };