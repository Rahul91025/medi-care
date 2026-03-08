import { Router } from "express";
import { createService, getServices, getServiceById, updateService, deleteService } from "../controllers/serviceController.js";
import upload from "../middleware/upload.js";

const router = Router();

router.get("/", getServices);
router.get("/:id", getServiceById);
router.post("/", upload.single("image"), createService);
router.put("/:id", upload.single("image"), updateService);
router.delete("/:id", deleteService);

export default router;
