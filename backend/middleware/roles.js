// Usage: router.get("/route", protect, roles("admin"), handler)
//        router.get("/route", protect, roles("admin","committee"), handler)

const roles = (...allowed) => (req, res, next) => {
  if (!allowed.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: `Access denied. Required role: ${allowed.join(" or ")}` });
  }
  next();
};

module.exports = { roles };