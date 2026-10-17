import DinnerModel from "./Dinner.model.js";

/* ===================== ADD DINNER ===================== */
export async function AddDinner(req, res) {
  try {
    const { name, price, category, description } = req.body;

    if (!name || !price || !req.file) {
      return res.json({
        success: false,
        msg: "Name, price and image are required",
      });
    }

    const dinner = await DinnerModel.create({
      name,
      price: Number(price),
      category: category || "Main Course",
      description: description || "",
      image: req.file.path,
    });

    return res.json({
      success: true,
      msg: "Dinner added successfully",
      dinner,
    });
  } catch (err) {
    console.error("AddDinner error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== ALL DINNERS ===================== */
export async function AllDinners(req, res) {
  try {
    const dinners = await DinnerModel.find().sort("-createdAt");
    return res.json({
      success: true,
      msg: "All dinners fetched",
      AllDinners: dinners,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== ONE DINNER ===================== */
export async function OneDinner(req, res) {
  try {
    const { id } = req.query;
    const dinner = id
      ? await DinnerModel.findById(id)
      : await DinnerModel.findOne();

    return res.json({
      success: true,
      msg: "Dinner fetched",
      OneDinner: dinner,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== UPDATE DINNER ===================== */
export async function UpdateDinner(req, res) {
  try {
    const { id, name, price, category, description } = req.body;
    if (!id) return res.json({ success: false, msg: "Dinner ID required" });

    const updates = {
      name,
      price: Number(price),
      category: category || "Main Course",
      description: description || "",
    };

    if (req.file) updates.image = req.file.path;

    const dinner = await DinnerModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!dinner) return res.json({ success: false, msg: "Dinner not found" });

    return res.json({ success: true, msg: "Dinner updated", dinner });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== DELETE DINNER ===================== */
export async function DeleteDinner(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, msg: "Dinner ID required" });
    await DinnerModel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Dinner deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}