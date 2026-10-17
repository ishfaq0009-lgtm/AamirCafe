import HallPackageModel from "./HallPackage.model.js";

export async function getAllPackages(req, res) {
  try {
    const packages = await HallPackageModel.find().sort("-createdAt");
    return res.json({ success: true, AllPackages: packages });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function getActivePackages(req, res) {
  try {
    const packages = await HallPackageModel.find({ isActive: true }).sort("basePrice");
    return res.json({ success: true, AllPackages: packages });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function getPackage(req, res) {
  try {
    const pkg = await HallPackageModel.findById(req.params.id);
    if (!pkg) return res.json({ success: false, msg: "Package not found" });
    return res.json({ success: true, package: pkg });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function createPackage(req, res) {
  try {
    const {
      name,
      description,
      basePrice,
      pricePerGuest,
      capacity,
      features,
      decorationOptions,
      isPopular,
    } = req.body;

    console.log("📥 [createPackage] body:", req.body);

    if (!name || basePrice === undefined) {
      return res.json({
        success: false,
        msg: "Name and basePrice required",
      });
    }

    const pkg = await HallPackageModel.create({
      name: name.trim(),
      description: description || "",
      basePrice: Number(basePrice),
      pricePerGuest: Number(pricePerGuest || 0),
      capacity: capacity || "Up to 300 guests",
      features: Array.isArray(features) ? features : [],
      decorationOptions: Array.isArray(decorationOptions)
        ? decorationOptions
        : [],
      isPopular: !!isPopular,
    });

    return res.json({ success: true, msg: "Package created", package: pkg });
  } catch (err) {
    console.error("❌ [createPackage] error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function updatePackage(req, res) {
  try {
    const { id, ...updates } = req.body;
    if (!id) return res.json({ success: false, msg: "Package ID required" });

    if (updates.basePrice !== undefined) updates.basePrice = Number(updates.basePrice);
    if (updates.pricePerGuest !== undefined)
      updates.pricePerGuest = Number(updates.pricePerGuest);
    if (updates.isPopular !== undefined) updates.isPopular = !!updates.isPopular;
    if (updates.isActive !== undefined) updates.isActive = !!updates.isActive;

    const pkg = await HallPackageModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!pkg) return res.json({ success: false, msg: "Package not found" });

    return res.json({ success: true, msg: "Package updated", package: pkg });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

export async function deletePackage(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, msg: "Package ID required" });
    await HallPackageModel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Package deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}