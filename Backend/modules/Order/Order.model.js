import mongoose from "mongoose";

const OrderItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "AddNewFood" },
  foodName: String,
  price: Number,
  quantity: Number,
  subtotal: Number,
  image: String,
});

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "userData" },

    items: [OrderItemSchema],
    subtotal: Number,
    deliveryCharges: { type: Number, default: 200 },
    total: Number,

    // Customer
    customerName: String,
    phone: String,
    email: String,

    // ⭐ Delivery location (lat/lng for map + live tracking)
    address: {
      label: String,
      street: String,
      city: String,
      state: String,
      zipCode: String,
      lat: Number,
      lng: Number,
    },

    // ⭐ Payment
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

    // ⭐ Status flow
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Preparing",
        "Ready",
        "Out for Delivery",
        "Delivered",
        "Rejected",
        "Cancelled",
      ],
      default: "Pending",
    },
    adminNote: { type: String, default: "" },

    // ⭐ Delivery assignment
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userData",
    },
    assignedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,

    // ⭐ Delivery man live location
    deliveryLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },

    // Notified to all delivery men?
    broadcastAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);