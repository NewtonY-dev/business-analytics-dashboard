import express from "express";
import {
  getKpis,
  getSalesByPeriod,
  getTopProducts,
} from "../controllers/analyticsController.js";
import authenticateToken from "../middlewares/auth.js";

const router = express.Router();

router.get("/kpis", authenticateToken, getKpis);
router.get("/salesByPeriod", authenticateToken, getSalesByPeriod);
router.get("/topProducts", authenticateToken, getTopProducts);

export default router;
