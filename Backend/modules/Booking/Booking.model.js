import mongoose from "mongoose";

const BookingFoodSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "AddNewFood" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  category: { type: String, default: "" },
  image: { type: String, default: "" },
});

const BookingDinnerSchema = new mongoose.Schema({
  dinnerId: { type: mongoose.Schema.Types.ObjectId, ref: "Dinner" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  category: { type: String, default: "" },
  image: { type: String, default: "" },
});

const BookingDrinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: Number, required: true, default: 1 },
});

const BookingSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    Phone: { type: String, required: true },
    email: { type: String, required: true },
    eventData: { type: String, required: true },
    eventtype: { type: String, required: true },
    Eventtime: { type: String, required: true },
    HallSection: { type: String, required: true },
    decoration: { type: String, default: "" },
    guests: { type: String, required: true },
    guestCount: { type: Number, default: 0 },
    message: { type: String, default: "" },

    hallPackage: { type: mongoose.Schema.Types.ObjectId, ref: "HallPackage" },
    packageName: { type: String, default: "" },

    // Selected items
    selectedFoods: [BookingFoodSchema],
    selectedDinners: [BookingDinnerSchema],
    coldDrinks: { type: [BookingDrinkSchema], default: [] },

    // Pricing
    basePrice: { type: Number, default: 0 },
    guestsCost: { type: Number, default: 0 },
    decorationCost: { type: Number, default: 0 },
    foodCost: { type: Number, default: 0 },
    dinnersCost: { type: Number, default: 0 },
    coldDrinksCost: { type: Number, default: 0 },
    totalAmount: { type: Number, default: 0 },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Easypaisa", "JazzCash", "Bank Transfer"],
      default: "Cash",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Pending", "Paid"],
      default: "Unpaid",
    },
    paymentReference: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected", "Completed"],
      default: "Pending",
    },
    adminNote: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("bookingData", BookingSchema);