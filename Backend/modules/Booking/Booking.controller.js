import Bookingmodel from "./Booking.model.js";

/* ===================== CREATE ===================== */
export async function BookingApi(req, res) {
  try {
    const booking = await Bookingmodel.create({
      ...req.body,
      status: "Pending",
    });
    return res.json({
      success: true,
      msg: "Booking request submitted. Awaiting approval.",
      booking,
    });
  } catch (err) {
    console.error("Booking error:", err);
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== GET ALL (Admin) ===================== */
export async function getBooking(req, res) {
  try {
    const all = await Bookingmodel.find().sort("-createdAt");
    return res.json({
      success: true,
      msg: "All bookings fetched",
      AllBookingData: all,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== GET BY EMAIL (User) ===================== */
export async function getMyBookings(req, res) {
  try {
    const { email } = req.query;
    if (!email) {
      return res.json({ success: false, msg: "email is required" });
    }
    const bookings = await Bookingmodel.find({ email }).sort("-createdAt");
    return res.json({ success: true, AllBookingData: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== GET ONE ===================== */
export async function PostUpDataBooking(req, res) {
  try {
    const { id } = req.body;
    const booking = await Bookingmodel.findById(id);
    if (!booking) return res.json({ success: false, msg: "Booking not found" });
    return res.json({ success: true, BookingID: booking });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== UPDATE FULL ===================== */
export async function UpdataApi(req, res) {
  try {
    const { id, ...updates } = req.body;
    if (!id) return res.json({ success: false, msg: "Booking ID required" });

    delete updates._id;
    delete updates.__v;
    delete updates.createdAt;
    delete updates.updatedAt;
    delete updates.status; // status is changed via the dedicated endpoint

    await Bookingmodel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: false,
    });

    return res.json({ success: true, msg: "Booking updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== ⭐ ACCEPT / REJECT / COMPLETE ===================== */
export async function UpdateBookingStatus(req, res) {
  try {
    const { id, status, adminNote = "" } = req.body;

    if (!id || !status) {
      return res.json({ success: false, msg: "Booking ID and status required" });
    }

    const allowed = ["Pending", "Accepted", "Rejected", "Completed"];
    if (!allowed.includes(status)) {
      return res.json({ success: false, msg: "Invalid status" });
    }

    const booking = await Bookingmodel.findByIdAndUpdate(
      id,
      { status, adminNote },
      { new: true }
    );

    if (!booking) return res.json({ success: false, msg: "Booking not found" });

    return res.json({
      success: true,
      msg: `Booking ${status.toLowerCase()}`,
      booking,
    });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}

/* ===================== DELETE ===================== */
export async function DeleteData(req, res) {
  try {
    const { id } = req.body;
    if (id) {
      await Bookingmodel.findByIdAndDelete(id);
    } else {
      await Bookingmodel.findOneAndDelete();
    }
    return res.json({ success: true, msg: "Booking deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, msg: err.message });
  }
}