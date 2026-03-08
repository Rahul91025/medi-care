import { Router } from "express";
import {
    createServiceAppointment, confirmServicePayment, getServiceAppointments,
    updateServiceAppointment, cancelServiceAppointment, getServiceAppointmentStats
} from "../controllers/serviceAppointmentController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", getServiceAppointments);
router.get("/confirm", confirmServicePayment);
router.get("/stats", getServiceAppointmentStats);
router.post("/", requireAuth, createServiceAppointment);
router.put("/:id", updateServiceAppointment);
router.delete("/:id", cancelServiceAppointment);

export default router;
