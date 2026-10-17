import express from "express";
import {
  BookingApi,
  getBooking,
  getMyBookings,
  PostUpDataBooking,
  UpdataApi,
  UpdateBookingStatus,
  DeleteData,
} from "./Booking.controller.js";

const router = express.Router();

router.post("/BookimgHall", BookingApi);
router.get("/AllBookingHall", getBooking);
router.get("/MyBookings", getMyBookings);
router.post("/UpdataBooking", PostUpDataBooking);
router.post("/BookingUpdataApi", UpdataApi);
router.post("/UpdateStatus", UpdateBookingStatus); // ⭐ NEW
router.post("/AllDataDelete", DeleteData);

export default router;