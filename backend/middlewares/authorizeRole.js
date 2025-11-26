function authorizeRole(requiredRole) {
  return (req, res, next) => {
    try {
      // req.user must be set by authenticateToken middleware (JWT verification)
      const user = req.user;
      if (!user)
        return res
          .status(401)
          .json({ success: false, message: "Not authenticated" });

      if (!user.role) {
        return res
          .status(403)
          .json({ success: false, message: "User role missing in token" });
      }

      // allow admin to pass or exact match
      if (user.role !== requiredRole) {
        return res
          .status(403)
          .json({ success: false, message: "Insufficient permissions" });
      }

      return next();
    } catch (err) {
      console.error("authorizeRole error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  };
}

export default authorizeRole;
