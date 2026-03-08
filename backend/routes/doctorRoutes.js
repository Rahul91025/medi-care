import { Router } from "express";
import { createDoctor, getDoctors, getDoctorById, updateDoctor, deleteDoctor, loginDoctor } from "../controllers/doctorController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.post("/", upload.single("image"), createDoctor);
router.post("/login", loginDoctor);
router.put("/:id", upload.single("image"), updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;
