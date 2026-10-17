import mongoose from "mongoose";

const DealItemSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: "AddNewFood" },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
});

const DealDrinkSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  quantity: { type: Number, default: 1 },
});

const DealSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    items: [DealItemSchema],
    coldDrinks: { type: [DealDrinkSchema], default: [] },
    dealPrice: { type: Number, required: true, min: 0 },
    image: { type: String, default: "" },
    tag: { type: String, default: "Deal" },
    isHot: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Deal", DealSchema);