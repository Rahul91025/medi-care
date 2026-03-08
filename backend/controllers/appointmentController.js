import Appointment from "../models/Appointment.js";
import Doctor from "../models/Doctor.js";
import Stripe from "stripe";
import { getAuth } from "../middleware/auth.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "";
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

/* ──── helpers ──── */
const safeNumber = (v) => { const n = Number(v); return Number.isFinite(n) ? n : null; };

const buildFrontendBase = (req) => {
  if (FRONTEND_URL) return FRONTEND_URL.replace(/\/$/, "");
  const origin = req.get("origin") || req.get("referer");
  if (origin) return origin.replace(/\/$/, "");
  const host = req.get("host");
  if (host) return `${req.protocol || "http"}://${host}`.replace(/\/$/, "");
  return null;
};

function resolveClerkUserId(req) {
  try {
    const auth = req.auth || {};
    const fromReq = auth?.userId || auth?.user_id || auth?.user?.id || req.user?.id || req.clerkUserId || null;
    if (fromReq) return fromReq;
    try {
      const serverAuth = getAuth ? getAuth(req) : null;
      return serverAuth?.userId || null;
    } catch { return null; }
  } catch { return null; }
}

/* ──── GET ALL ──── */
export const getAppointments = async (req, res) => {
  try {
    const { doctorId, mobile, status, search = "", limit: limitRaw = 50, page: pageRaw = 1, patientClerkId, createdBy } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = {};
    if (doctorId) filter.doctorId = doctorId;
    if (mobile) filter.mobile = mobile;
    if (status) filter.status = status;
    if (patientClerkId) filter.createdBy = patientClerkId;
    if (createdBy) filter.createdBy = createdBy;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { notes: re }];
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Appointment.countDocuments(filter);
    return res.json({ success: true, data: appointments, meta: { page, limit, total } });
  } catch (err) {
    console.error("getAppointments:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ──── CREATE ──── */
export const createAppointment = async (req, res) => {
  try {
    const clerkUserId = resolveClerkUserId(req);
    const {
      doctorId, patientName, mobile, age = "", gender = "",
      date, time, fee, fees, notes = "", email,
      paymentMethod, owner: ownerFromBody = null,
      doctorName: doctorNameFromBody, speciality: specialityFromBody,
      doctorImageUrl: doctorImageUrlFromBody, doctorImagePublicId: doctorImagePublicIdFromBody,
    } = req.body || {};

    if (!doctorId || !patientName || !mobile || !date || !time) {
      return res.status(400).json({ success: false, message: "doctorId, patientName, mobile, date, and time are required" });
    }

    const doctor = await Doctor.findById(doctorId).lean();
    if (!doctor) return res.status(404).json({ success: false, message: "Doctor not found" });

    const numericFee = safeNumber(fee ?? fees ?? doctor.fee ?? 0) ?? 0;

    const doctorName = (doctor.name && String(doctor.name).trim()) || (doctorNameFromBody && String(doctorNameFromBody).trim()) || "";
    const speciality = (doctor.specialization && String(doctor.specialization).trim()) || (specialityFromBody && String(specialityFromBody).trim()) || "";

    const doctorImageUrl = doctor.imageUrl || (doctorImageUrlFromBody && String(doctorImageUrlFromBody).trim()) || "";
    const doctorImagePublicId = doctor.imagePublicId || (doctorImagePublicIdFromBody && String(doctorImagePublicIdFromBody).trim()) || "";
    const doctorImage = { url: doctorImageUrl, publicId: doctorImagePublicId };

    const base = {
      doctorId: String(doctor._id || doctorId),
      doctorName, speciality, doctorImage,
      patientName: String(patientName).trim(),
      mobile: String(mobile).trim(),
      age: age ? Number(age) : undefined,
      gender: gender ? String(gender) : "",
      date: String(date), time: String(time),
      fees: numericFee,
      status: "Pending",
      payment: { method: paymentMethod === "Cash" ? "Cash" : "Online", status: "Pending", amount: numericFee },
      notes: notes || "", email: email || "",
      createdBy: clerkUserId,
      owner: ownerFromBody || doctor.owner || null,
      sessionId: null,
    };

    // Free appointment
    if (numericFee === 0) {
      const created = await Appointment.create({
        ...base,
        status: "Confirmed",
        payment: { method: base.payment.method, status: "Paid", amount: 0 },
        paidAt: new Date(),
      });
      return res.status(201).json({ success: true, appointment: created, checkoutUrl: null });
    }

    // Cash payment
    if (paymentMethod === "Cash") {
      const created = await Appointment.create({
        ...base, status: "Pending",
        payment: { method: "Cash", status: "Pending", amount: numericFee },
      });
      return res.status(201).json({ success: true, appointment: created, checkoutUrl: null });
    }

    // Online: Stripe
    if (!stripe) return res.status(500).json({ success: false, message: "Stripe not configured on server" });

    const frontBase = buildFrontendBase(req);
    if (!frontBase) {
      return res.status(500).json({ success: false, message: "Frontend URL could not be determined." });
    }

    const successUrl = `${frontBase}/appointment/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${frontBase}/appointment/cancel`;

    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: email || undefined,
        line_items: [{
          price_data: {
            currency: "inr",
            product_data: { name: `Appointment - ${String(patientName).slice(0, 40)}` },
            unit_amount: Math.round(numericFee * 100),
          },
          quantity: 1,
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { doctorId: String(doctorId), doctorName: doctorName || "", speciality: speciality || "", patientName: base.patientName, mobile: base.mobile, clerkUserId: clerkUserId || "" },
      });
    } catch (stripeErr) {
      console.error("Stripe create session error:", stripeErr);
      return res.status(502).json({ success: false, message: `Payment provider error: ${stripeErr?.message || "Stripe error"}` });
    }

    try {
      const created = await Appointment.create({
        ...base, sessionId: session.id,
        payment: { ...base.payment, providerId: session.payment_intent || null },
        status: "Pending",
      });
      return res.status(201).json({ success: true, appointment: created, checkoutUrl: session.url || null });
    } catch (dbErr) {
      console.error("DB error:", dbErr);
      return res.status(500).json({ success: false, message: "Failed to create appointment record" });
    }
  } catch (err) {
    console.error("createAppointment unexpected:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ──── CONFIRM PAYMENT ──── */
export const confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ success: false, message: "session_id is required" });
    if (!stripe) return res.status(500).json({ success: false, message: "Stripe not configured" });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== "paid") {
      return res.status(400).json({ success: false, message: "Payment not completed" });
    }

    let appt = await Appointment.findOneAndUpdate(
      { sessionId: session_id },
      { "payment.status": "Paid", "payment.providerId": session.payment_intent || null, status: "Confirmed", paidAt: new Date() },
      { new: true }
    );

    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found for this payment session" });
    return res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("confirmPayment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ──── UPDATE ──── */
export const updateAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

    const body = req.body || {};
    const terminal = appt.status === "Completed" || appt.status === "Canceled";
    if (terminal && body.status && body.status !== appt.status) {
      return res.status(400).json({ success: false, message: "Cannot change status of a completed/canceled appointment" });
    }

    const update = {};
    if (body.status) update.status = body.status;
    if (body.notes !== undefined) update.notes = body.notes;

    if (body.date && body.time) {
      if (terminal) return res.status(400).json({ success: false, message: "Cannot reschedule completed/canceled appointment" });
      update.date = body.date;
      update.time = body.time;
      update.status = "Rescheduled";
      update.rescheduledTo = { date: body.date, time: body.time };
    }

    if (body["payment.status"]) update["payment.status"] = body["payment.status"];

    const updated = await Appointment.findByIdAndUpdate(req.params.id, { $set: update }, { new: true });
    return res.json({ success: true, appointment: updated });
  } catch (err) {
    console.error("updateAppointment:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ──── STATS ──── */
export const getStats = async (req, res) => {
  try {
    const totalAppointments = await Appointment.countDocuments();
    const confirmed = await Appointment.countDocuments({ status: "Confirmed" });
    const completed = await Appointment.countDocuments({ status: "Completed" });
    const canceled = await Appointment.countDocuments({ status: "Canceled" });
    const pending = await Appointment.countDocuments({ status: "Pending" });

    const paidAgg = await Appointment.aggregate([{ $match: { "payment.status": "Paid" } }, { $group: { _id: null, total: { $sum: "$fees" } } }]);
    const revenue = (paidAgg[0] && paidAgg[0].total) || 0;

    return res.json({ success: true, data: { totalAppointments, confirmed, completed, canceled, pending, revenue } });
  } catch (err) {
    console.error("getStats:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ──── GET BY DOCTOR ──── */
export const getAppointmentsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { mobile, status, search = "", limit: limitRaw = 50, page: pageRaw = 1 } = req.query;
    const limit = Math.min(200, Math.max(1, parseInt(limitRaw, 10) || 50));
    const page = Math.max(1, parseInt(pageRaw, 10) || 1);
    const skip = (page - 1) * limit;

    const filter = { doctorId };
    if (mobile) filter.mobile = mobile;
    if (status) filter.status = status;
    if (search) {
      const re = new RegExp(search, "i");
      filter.$or = [{ patientName: re }, { mobile: re }, { notes: re }];
    }

    const appointments = await Appointment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean();
    const total = await Appointment.countDocuments(filter);
    return res.json({ success: true, data: appointments, meta: { page, limit, total } });
  } catch (err) {
    console.error("getAppointmentsByDoctor:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
