import express from "express";
const router = express.Router();
import authenticateToken from "../middlewares/auth.js";

router.get("/private", authenticateToken, (req, res) => {
  return res.json({ success: true, message: "Authenticated", user: req.user });
});

export default router;
