import Ordermodel from "./Order.model.js";

/* ============ CREATE ORDER ============ */
export async function CreateOrder(req, res) {
  try {
    const {
      userId,
      items,
      subtotal,
      deliveryCharges,
      total,
      customerName,
      phone,
      email,
      address,
      paymentMethod,
      paymentReference,
    } = req.body;

    if (!items || items.length === 0) {
      return res.json({ success: false, msg: "No items in order" });
    }

    const order = await Ordermodel.create({
      userId,
      items,
      subtotal,
      deliveryCharges,
      total,
      customerName,
      phone,
      email,
      address,
      paymentMethod: paymentMethod || "Cash",
      paymentReference: paymentReference || "",
      paymentStatus: paymentMethod === "Cash" ? "Unpaid" : "Pending",
      status: "Pending",
    });

    return res.status(201).json({
      success: true,
      msg: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.error("CreateOrder error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ ALL ORDERS (admin) ============ */
export async function GetAllOrders(req, res) {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const orders = await Ordermodel.find(filter)
      .populate("userId", "name email phone")
      .populate("deliveryPerson", "name phone vehicle")
      .sort("-createdAt");
    return res.json({ success: true, AllOrders: orders });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ MY ORDERS (user) ============ */
export async function GetMyOrders(req, res) {
  try {
    const { userId } = req.query;
    if (!userId) return res.json({ success: false, msg: "userId required" });
    const orders = await Ordermodel.find({ userId })
      .populate("deliveryPerson", "name phone vehicle currentLocation")
      .sort("-createdAt");
    return res.json({ success: true, AllOrders: orders });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ SINGLE ORDER ============ */
export async function GetOrder(req, res) {
  try {
    const { id } = req.params;
    const order = await Ordermodel.findById(id)
      .populate("userId", "name email phone")
      .populate("deliveryPerson", "name phone vehicle currentLocation rating");
    if (!order) return res.json({ success: false, msg: "Order not found" });
    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ UPDATE STATUS (admin) ============ */
export async function UpdateOrderStatus(req, res) {
  try {
    const { id, status, adminNote = "" } = req.body;
    if (!id || !status) {
      return res.json({ success: false, msg: "id and status required" });
    }

    const updates = { status };
    if (adminNote) updates.adminNote = adminNote;

    // Auto-update timestamps based on status
    if (status === "Delivered") {
      updates.deliveredAt = new Date();
      updates.paymentStatus = "Paid";
    }
    if (status === "Out for Delivery" && !req.body.deliveryPerson) {
      return res.json({
        success: false,
        msg: "Please assign a delivery person first",
      });
    }

    const order = await Ordermodel.findByIdAndUpdate(id, updates, { new: true })
      .populate("userId", "name email phone")
      .populate("deliveryPerson", "name phone vehicle");

    if (!order) return res.json({ success: false, msg: "Order not found" });

    return res.json({ success: true, msg: `Order ${status}`, order });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ ASSIGN DELIVERY MAN (admin) ============ */
export async function AssignDelivery(req, res) {
  try {
    const { id, deliveryPersonId } = req.body;
    if (!id || !deliveryPersonId) {
      return res.json({ success: false, msg: "Order ID and delivery man ID required" });
    }

    const order = await Ordermodel.findByIdAndUpdate(
      id,
      {
        deliveryPerson: deliveryPersonId,
        assignedAt: new Date(),
        status: "Out for Delivery",
        broadcastAt: new Date(),
      },
      { new: true }
    )
      .populate("userId", "name email phone")
      .populate("deliveryPerson", "name phone vehicle currentLocation");

    if (!order) return res.json({ success: false, msg: "Order not found" });

    return res.json({ success: true, msg: "Delivery man assigned", order });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ AVAILABLE ORDERS FOR DELIVERY MEN ============ */
export async function GetAvailableForDelivery(req, res) {
  try {
    // Orders that are accepted and not yet assigned
    const orders = await Ordermodel.find({
      status: "Accepted",
      deliveryPerson: null,
    })
      .populate("userId", "name email phone")
      .sort("-createdAt");

    return res.json({ success: true, AllOrders: orders });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ DELIVERY MAN CLAIMS ORDER ============ */
export async function ClaimOrder(req, res) {
  try {
    const { orderId, deliveryPersonId } = req.body;
    if (!orderId || !deliveryPersonId) {
      return res.json({ success: false, msg: "Missing fields" });
    }

    const order = await Ordermodel.findById(orderId);
    if (!order) return res.json({ success: false, msg: "Order not found" });
    if (order.deliveryPerson) {
      return res.json({ success: false, msg: "Already claimed" });
    }

    order.deliveryPerson = deliveryPersonId;
    order.assignedAt = new Date();
    order.status = "Out for Delivery";
    await order.save();

    return res.json({ success: true, msg: "Order claimed", order });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ MY DELIVERIES (delivery man) ============ */
export async function GetMyDeliveries(req, res) {
  try {
    const { deliveryPersonId } = req.query;
    if (!deliveryPersonId) {
      return res.json({ success: false, msg: "deliveryPersonId required" });
    }
    const orders = await Ordermodel.find({
      deliveryPerson: deliveryPersonId,
      status: { $in: ["Out for Delivery", "Preparing", "Ready"] },
    })
      .populate("userId", "name email phone")
      .sort("-createdAt");

    const completed = await Ordermodel.find({
      deliveryPerson: deliveryPersonId,
      status: "Delivered",
    }).sort("-deliveredAt");

    return res.json({
      success: true,
      activeOrders: orders,
      completedOrders: completed,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ============ DELIVERY MAN UPDATES LOCATION ============ */
export async function UpdateOrderLocation(req, res) {
  try {
    const { orderId, lat, lng } = req.body;
    if (!orderId || lat === undefined || lng === undefined) {
      return res.json({ success: false, msg: "Missing fields" });
    }

    await Ordermodel.findByIdAndUpdate(orderId, {
      deliveryLocation: {
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

/* ============ DELIVERY MAN MARKS DELIVERED ============ */
export async function MarkDelivered(req, res) {
  try {
    const { orderId } = req.body;
    const order = await Ordermodel.findByIdAndUpdate(
      orderId,
      {
        status: "Delivered",
        deliveredAt: new Date(),
        paymentStatus: "Paid",
      },
      { new: true }
    );

    // Increment delivery man's count
    if (order?.deliveryPerson) {
      const usermodel = (await import("../user/user.model.js")).default;
      await usermodel.findByIdAndUpdate(order.deliveryPerson, {
        $inc: { totalDeliveries: 1 },
      });
    }

    return res.json({ success: true, order });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}