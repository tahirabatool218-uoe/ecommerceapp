import { Router } from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} from "../controllers/orderController";
import protect from "../middleware/authMiddleware";
import admin from "../middleware/adminMiddleware";

const router = Router();

// User routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Admin routes
router.get("/", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.delete("/:id", protect, admin, deleteOrder);

export default router;
