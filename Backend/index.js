import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import userRouter from "./modules/user/user.route.js";
import BookingRouter from "./modules/Booking/Booking.route.js";
import AddFoodRouter from "./modules/AddNewFood/AddFood.route.js";
import OrderRouter from "./modules/Order/Order.route.js";
import HallPackageRouter from "./modules/HallPackage/HallPackage.route.js";
import DealRouter from "./modules/Deal/Deal.route.js";
import DinnerRouter from "./modules/Dinner/Dinner.route.js";
import ChatRouter from "./modules/Chat/Chat.route.js"; // ⭐ Added

import dbconection from "./shared/db/dbconection.js";

dotenv.config();
dbconection();

const app = express();

/* ===================== MIDDLEWARE ===================== */
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===================== ROUTES ===================== */
app.use("/user", userRouter);
app.use("/Booking", BookingRouter);
app.use("/AddNewFastFood", AddFoodRouter);
app.use("/Order", OrderRouter);
app.use("/HallPackage", HallPackageRouter);
app.use("/Deal", DealRouter);
app.use("/Dinner", DinnerRouter);
app.use("/Chat", ChatRouter); // ⭐ Added

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.json({ success: true, msg: "Amir Café & Marriage Hall API is running" });
});

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);
  res.status(err.status || 500).json({
    success: false,
    msg: err.message || "Internal Server Error",
  });
});

/* ===================== START ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});