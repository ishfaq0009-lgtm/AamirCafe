import DealModel from "./Deal.model.js";

function cleanDrinks(drinks) {
  if (!Array.isArray(drinks)) return [];
  return drinks
    .filter((d) => d && d.name && String(d.name).trim())
    .map((d) => ({
      name: String(d.name).trim(),
      price: Number(d.price) || 0,
      quantity: Number(d.quantity) || 1,
    }));
}

export async function getAllDeals(req, res) {
  try {
    const deals = await DealModel.find().sort("-createdAt");
    return res.json({ success: true, AllDeals: deals });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function getActiveDeals(req, res) {
  try {
    const deals = await DealModel.find({ isActive: true }).sort("-createdAt");
    return res.json({ success: true, AllDeals: deals });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function getHotDeals(req, res) {
  try {
    const deals = await DealModel.find({ isActive: true, isHot: true }).sort(
      "-createdAt"
    );
    return res.json({ success: true, AllDeals: deals });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function getDeal(req, res) {
  try {
    const deal = await DealModel.findById(req.params.id);
    if (!deal) return res.json({ success: false, msg: "Deal not found" });
    return res.json({ success: true, deal });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function createDeal(req, res) {
  try {
    const {
      title,
      description,
      items,
      coldDrinks,
      dealPrice,
      image,
      tag,
      isHot,
    } = req.body;

    if (!title || !items || items.length === 0 || dealPrice === undefined) {
      return res.json({
        success: false,
        msg: "Title, items and deal price required",
      });
    }

    const deal = await DealModel.create({
      title,
      description: description || "",
      items,
      coldDrinks: cleanDrinks(coldDrinks),
      dealPrice: Number(dealPrice),
      image: image || items[0]?.image || "",
      tag: tag || "Deal",
      isHot: !!isHot,
      isActive: true,
    });

    return res.json({ success: true, msg: "Deal created", deal });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function updateDeal(req, res) {
  try {
    const { id, coldDrinks, ...updates } = req.body;
    if (!id) return res.json({ success: false, msg: "ID required" });

    if (updates.dealPrice !== undefined)
      updates.dealPrice = Number(updates.dealPrice);
    if (updates.isHot !== undefined) updates.isHot = !!updates.isHot;
    if (updates.isActive !== undefined) updates.isActive = !!updates.isActive;
    if (coldDrinks !== undefined) updates.coldDrinks = cleanDrinks(coldDrinks);

    const deal = await DealModel.findByIdAndUpdate(id, updates, { new: true });
    if (!deal) return res.json({ success: false, msg: "Deal not found" });
    return res.json({ success: true, msg: "Deal updated", deal });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function deleteDeal(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, msg: "ID required" });
    await DealModel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Deal deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}