import express from "express";

import {
  listSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
  exportSalesJson,
} from "../controllers/salesController.js";

import authenticateToken from "../middlewares/auth.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/listSales", authenticateToken, listSales);

router.get("/getSaleById/:id", authenticateToken, getSaleById);

router.post(
  "/createSale",
  authenticateToken,
  authorizeRole("admin"),
  createSale
);

router.put(
  "/updateSale/:id",
  authenticateToken,
  authorizeRole("admin"),
  updateSale
);

router.delete(
  "/deleteSale/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteSale
);

router.get("/exportSales", authenticateToken, exportSalesJson);

export default router;
