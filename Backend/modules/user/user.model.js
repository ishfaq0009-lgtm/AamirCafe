import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, default: "" },
    profileImage: { type: String, default: "" },

    role: {
      type: String,
      enum: ["User", "Admin", "Delivery"],
      default: "User",
    },

    // Delivery man fields
    vehicle: { type: String, default: "" },
    vehicleNumber: { type: String, default: "" },
    currentLocation: {
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      updatedAt: Date,
    },
    isAvailable: { type: Boolean, default: true },
    totalDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
  },
  { timestamps: true }
);

export default mongoose.model("userData", userSchema);