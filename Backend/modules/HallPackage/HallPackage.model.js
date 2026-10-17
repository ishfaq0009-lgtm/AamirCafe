import mongoose from "mongoose";

const DecorationOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
});

const HallPackageSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    basePrice: { type: Number, required: true, min: 0 },
    pricePerGuest: { type: Number, default: 0 },
    capacity: { type: String, default: "Up to 300 guests" },
    features: [{ type: String }],
    decorationOptions: [DecorationOptionSchema],
    isPopular: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("HallPackage", HallPackageSchema);