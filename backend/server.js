const express = require("express");
const cors = require("cors");
const path = require("path");
require("express-async-errors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes         = require("./routes/auth");
const adminRoutes        = require("./routes/admin");
const committeeRoutes    = require("./routes/committee");
const eventRoutes        = require("./routes/events");
const registrationRoutes = require("./routes/registrations");
const galleryRoutes      = require("./routes/gallery");

const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth",          authRoutes);
app.use("/api/admin",         adminRoutes);
app.use("/api/committee",     committeeRoutes);
app.use("/api/events",        eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/gallery",       galleryRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Smart Event Management API running" }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({ success: false, message: err.message || "Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));