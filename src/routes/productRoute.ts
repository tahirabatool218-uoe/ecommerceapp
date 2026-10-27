import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/productController";
import protect from "../middleware/authMiddleware";
import admin from "../middleware/adminMiddleware";

const router = Router();

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin-only routes
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
