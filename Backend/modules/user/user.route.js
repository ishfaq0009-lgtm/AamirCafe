import express from "express";
import {
  registration,
  login,
  checkAdmin,
  checkUser,
  createDeliveryMan,
  getDeliveryMen,
  deleteDeliveryMan,
  updateDeliveryMan,
  updateMyProfile,
  updateDeliveryLocation,
} from "./user.controller.js";
import upload from "../../shared/config/middleware/multer.middeware.js";

const router = express.Router();

/* ============ Auth ============ */
router.post("/userRegistr", registration);
router.post("/login", login);
router.post("/AdminChek", checkAdmin);
router.post("/UserChek", checkUser);

/* ============ Delivery Man Management ============ */
router.post("/CreateDeliveryMan", createDeliveryMan);
router.get("/AllDeliveryMen", getDeliveryMen);
router.post("/DeleteDeliveryMan", deleteDeliveryMan);
router.post(
  "/UpdateDeliveryMan",
  upload.single("profileImage"),
  updateDeliveryMan
);
router.post("/UpdateDeliveryLocation", updateDeliveryLocation);

/* ============ Self Profile ============ */
router.post("/UpdateMyProfile", upload.single("profileImage"), updateMyProfile);

export default router;