import usermodel from "./user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ===================== REGISTER ===================== */
export async function registration(req, res) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.json({ success: false, msg: "All fields are required" });
    }

    // ⭐ Only User & Admin can self-register. Delivery men are added by Admin.
    const allowedRoles = ["User", "Admin"];
    if (!allowedRoles.includes(role)) {
      return res.json({
        success: false,
        msg: "Only User and Admin can register. Delivery men are added by an Admin.",
      });
    }

    const existing = await usermodel.findOne({ email });
    if (existing) {
      return res.json({ success: false, msg: "This email is already registered" });
    }

    // Only one Admin allowed
    if (role === "Admin") {
      const adminExists = await usermodel.findOne({ role: "Admin" });
      if (adminExists) {
        return res.json({ success: false, msg: "An admin already exists" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await usermodel.create({
      name,
      email,
      password: hashed,
      role,
    });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("amir_token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      msg: "Registration successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== LOGIN ===================== */
export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.json({ success: false, msg: "Email, password and role are required" });
    }

    const user = await usermodel.findOne({ email, role });
    if (!user) {
      return res.json({ success: false, msg: "Invalid email or role" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, msg: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("amir_token", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      msg: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        vehicle: user.vehicle,
        vehicleNumber: user.vehicleNumber,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== ADMIN CHECK ===================== */
export async function checkAdmin(req, res) {
  try {
    const token =
      req.cookies?.amir_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) return res.json({ success: false, msg: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "Admin") {
      return res.json({ success: false, msg: "User is not an admin" });
    }

    return res.json({ success: true, msg: "Admin verified" });
  } catch (err) {
    return res.json({ success: false, msg: "Invalid or expired token" });
  }
}

/* ===================== USER CHECK ===================== */
export async function checkUser(req, res) {
  try {
    const token =
      req.cookies?.amir_token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) return res.json({ success: false, msg: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ success: true, msg: "User verified", userId: decoded.id });
  } catch (err) {
    return res.json({ success: false, msg: "Invalid or expired token" });
  }
}

/* ===================== CREATE DELIVERY MAN (Admin) ===================== */
export async function createDeliveryMan(req, res) {
  try {
    const { name, email, password, phone, vehicle, vehicleNumber } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, msg: "Name, email, password required" });
    }

    const exists = await usermodel.findOne({ email });
    if (exists) {
      return res.json({ success: false, msg: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const deliveryMan = await usermodel.create({
      name,
      email,
      password: hashed,
      phone: phone || "",
      vehicle: vehicle || "",
      vehicleNumber: vehicleNumber || "",
      role: "Delivery",
    });

    return res.json({
      success: true,
      msg: "Delivery man created",
      deliveryMan: {
        _id: deliveryMan._id,
        name: deliveryMan.name,
        email: deliveryMan.email,
        phone: deliveryMan.phone,
        vehicle: deliveryMan.vehicle,
        vehicleNumber: deliveryMan.vehicleNumber,
      },
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== GET ALL DELIVERY MEN ===================== */
export async function getDeliveryMen(req, res) {
  try {
    const men = await usermodel
      .find({ role: "Delivery" })
      .select("-password")
      .sort("-createdAt");
    return res.json({ success: true, deliveryMen: men });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== DELETE DELIVERY MAN ===================== */
export async function deleteDeliveryMan(req, res) {
  try {
    const { id } = req.body;
    if (!id) return res.json({ success: false, msg: "ID required" });
    await usermodel.findByIdAndDelete(id);
    return res.json({ success: true, msg: "Delivery man deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== UPDATE DELIVERY MAN (Admin) ===================== */
export async function updateDeliveryMan(req, res) {
  try {
    const {
      id,
      name,
      email,
      phone,
      vehicle,
      vehicleNumber,
      password,
      profileImage,
    } = req.body;

    if (!id) return res.json({ success: false, msg: "ID required" });

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (vehicle !== undefined) updates.vehicle = vehicle;
    if (vehicleNumber !== undefined) updates.vehicleNumber = vehicleNumber;

    if (req.file?.path) {
      updates.profileImage = req.file.path;
    } else if (profileImage !== undefined) {
      updates.profileImage = profileImage;
    }

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updated = await usermodel
      .findByIdAndUpdate(id, updates, { new: true })
      .select("-password");

    if (!updated)
      return res.json({ success: false, msg: "Delivery man not found" });

    return res.json({
      success: true,
      msg: "Delivery man updated",
      deliveryMan: updated,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== UPDATE MY PROFILE (any logged-in user) ===================== */
export async function updateMyProfile(req, res) {
  try {
    const { id, name, phone, vehicle, vehicleNumber, password } = req.body;
    if (!id) return res.json({ success: false, msg: "ID required" });

    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (vehicle !== undefined) updates.vehicle = vehicle;
    if (vehicleNumber !== undefined) updates.vehicleNumber = vehicleNumber;

    if (req.file?.path) {
      updates.profileImage = req.file.path;
    }

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const updated = await usermodel
      .findByIdAndUpdate(id, updates, { new: true })
      .select("-password");

    if (!updated) return res.json({ success: false, msg: "User not found" });

    return res.json({ success: true, msg: "Profile updated", user: updated });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== UPDATE DELIVERY LOCATION ===================== */
export async function updateDeliveryLocation(req, res) {
  try {
    const { id, lat, lng } = req.body;
    if (!id || lat === undefined || lng === undefined) {
      return res.json({ success: false, msg: "id, lat, lng required" });
    }

    await usermodel.findByIdAndUpdate(id, {
      currentLocation: {
        lat: Number(lat),
        lng: Number(lng),
        updatedAt: new Date(),
      },
    });

    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}