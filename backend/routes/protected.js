import express from "express";
const router = express.Router();
import authenticateToken from "../middlewares/auth.js";
import authorizeRole from "../middlewares/authorizeRole.js";

router.get("/private", authenticateToken, (req, res) => {
  return res.json({ success: true, message: "Authenticated", user: req.user });
});

// Only admins
router.get(
  "/admin",
  authenticateToken,
  authorizeRole("admin"),
  (req, res) => {
    return res.json({ success: true, message: "Admin route", user: req.user });
  }
);

export default router;
