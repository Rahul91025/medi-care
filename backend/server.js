import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import { clerkAuth } from "./middleware/auth.js";

// Routes
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import serviceAppointmentRoutes from "./routes/serviceAppointmentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4000;

// ──── CORS ────
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    process.env.ADMIN_URL || "http://localhost:5174",
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
].filter(Boolean);

app.use(cors({
    origin: (origin, cb) => {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return cb(null, true);
        if (allowedOrigins.some((o) => origin.startsWith(o))) return cb(null, true);
        return cb(null, true); // In development, allow all origins
    },
    credentials: true,
}));

// ──── Body Parsing ────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ──── Static files (uploaded images) ────
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ──── DB connection middleware (connects once, caches for serverless) ────
app.use(async (_req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error("DB connection failed:", err);
        res.status(500).json({ success: false, message: "Database connection failed" });
    }
});

// ──── Clerk Auth Middleware (populates req.auth) ────
app.use(clerkAuth);

// ──── API Routes ────
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-appointments", serviceAppointmentRoutes);

// ──── Health check ────
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "MediCare API is running", timestamp: new Date().toISOString() });
});

// ──── 404 handler ────
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

// ──── Error handler ────
app.use((err, _req, res, _next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
});

// ──── Local dev: start listening ────
if (process.env.NODE_ENV !== "production") {
    connectDB().then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API: http://localhost:${PORT}/api/health`);
        });
    }).catch((err) => {
        console.error("Failed to start server:", err);
        process.exit(1);
    });
}

export default app;
