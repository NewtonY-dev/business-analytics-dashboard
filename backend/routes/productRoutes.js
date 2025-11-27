import express from "express";

import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import authenticateToken from "../middlewares/auth.js";
import authorizeRole from "../middlewares/authorizeRole.js";

const router = express.Router();

router.get("/listProducts", authenticateToken, listProducts);

router.get("/getProductById/:id", authenticateToken, getProductById);

router.post(
  "/createProduct",
  authenticateToken,
  authorizeRole("admin"),
  createProduct
);

router.put(
  "/updateProduct/:id",
  authenticateToken,
  authorizeRole("admin"),
  updateProduct
);

router.delete(
  "/deleteProduct/:id",
  authenticateToken,
  authorizeRole("admin"),
  deleteProduct
);

export default router;
