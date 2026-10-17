import express from "express";
import {
  CreateOrder,
  GetAllOrders,
  GetMyOrders,
  GetOrder,
  UpdateOrderStatus,
  AssignDelivery,
  GetAvailableForDelivery,
  ClaimOrder,
  GetMyDeliveries,
  UpdateOrderLocation,
  MarkDelivered,
} from "./Order.controller.js";

const router = express.Router();

router.post("/CreateOrderApi", CreateOrder);
router.get("/AllOrders", GetAllOrders);
router.get("/MyOrders", GetMyOrders);
router.get("/Order/:id", GetOrder);

// Admin
router.post("/UpdateStatus", UpdateOrderStatus);
router.post("/AssignDelivery", AssignDelivery);

// Delivery
router.get("/AvailableForDelivery", GetAvailableForDelivery);
router.post("/ClaimOrder", ClaimOrder);
router.get("/MyDeliveries", GetMyDeliveries);
router.post("/UpdateLocation", UpdateOrderLocation);
router.post("/MarkDelivered", MarkDelivered);

export default router;