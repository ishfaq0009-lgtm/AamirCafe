import mongoose from "mongoose";

const DinnerSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: "Main Course", trim: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Dinner", DinnerSchema);