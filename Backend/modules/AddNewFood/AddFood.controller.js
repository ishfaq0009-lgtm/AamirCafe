import AddFoodmodel from "./AddFood.model.js";

/* ============ helper: parse size options ============ */
function parseSizes(sizes) {
  if (!sizes) return [];
  try {
    const raw = typeof sizes === "string" ? JSON.parse(sizes) : sizes;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((s) => s && s.name && s.price !== undefined && s.price !== "")
      .map((s) => ({ name: String(s.name).trim(), price: Number(s.price) }));
  } catch {
    return [];
  }
}

/* ===================== ADD FOOD ===================== */
export async function AddFood(req, res) {
  try {
    const { name, price, category, description, sizes } = req.body;

    if (!name || !price || !category || !req.file) {
      return res.json({
        success: false,
        msg: "Name, price, category and image are required",
      });
    }

    const food = await AddFoodmodel.create({
      name,
      price: Number(price),
      category,
      description: description || "",
      image: req.file.path,
      sizes: parseSizes(sizes),
    });

    return res.json({ success: true, msg: "Food added successfully", food });
  } catch (err) {
    console.error("AddFood error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== ALL FOOD ===================== */
export async function AllFood(req, res) {
  try {
    const allFood = await AddFoodmodel.find().sort("-createdAt");
    return res.json({
      success: true,
      msg: "All food fetched",
      AllFood: allFood,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== ONE FOOD ===================== */
export async function OneFood(req, res) {
  try {
    const { id } = req.query;
    const food = id
      ? await AddFoodmodel.findById(id)
      : await AddFoodmodel.findOne();

    return res.json({
      success: true,
      msg: "Food fetched",
      OneFood: food,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ UPDATE FOOD ============ */
export async function UpdateFood(req, res) {
  try {
    const { id, name, price, category, description, sizes } = req.body;
    if (!id) return res.json({ success: false, msg: "Food ID required" });

    const updates = {
      name,
      price: Number(price),
      category,
      description,
    };

    if (sizes !== undefined) updates.sizes = parseSizes(sizes);

    // Only replace image if new one uploaded
    if (req.file) updates.image = req.file.path;

    const food = await AddFoodmodel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!food) return res.json({ success: false, msg: "Food not found" });

    return res.json({ success: true, msg: "Food updated", food });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ DELETE FOOD ============ */
export async function DeleteFood(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, msg: "Food ID required" });
    await AddFoodmodel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Food deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}