export const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admins only.",
      });
    }
  } catch (error) {
    console.error("isAdmin Middleware Error:", error.message);
    res.status(500).json({ success: false, message: "Server error." });
  }
};
