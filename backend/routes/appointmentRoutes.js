import { Router } from "express";
import { getAppointments, createAppointment, confirmPayment, updateAppointment, getStats, getAppointmentsByDoctor } from "../controllers/appointmentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getAppointments);
router.get("/stats", getStats);
router.get("/confirm", confirmPayment);
router.get("/doctor/:doctorId", getAppointmentsByDoctor);
router.post("/", requireAuth, createAppointment);
router.put("/:id", updateAppointment);

export default router;
