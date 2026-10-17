import mongoose from "mongoose";

const SizeOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
});

const AddFoodSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, required: true },
    sizes: { type: [SizeOptionSchema], default: [] },
  },
  { timestamps: true }
);

const AddFoodmodel = mongoose.model("AddNewFood", AddFoodSchema);

export default AddFoodmodel;