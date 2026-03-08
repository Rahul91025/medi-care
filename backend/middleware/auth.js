import { clerkMiddleware, getAuth } from "@clerk/express";

// Check if we have a valid secret key (must start with sk_)
const hasValidSecret = process.env.CLERK_SECRET_KEY && process.env.CLERK_SECRET_KEY.startsWith("sk_");

let authMiddleware;
try {
    // Only initialize clerk if we have a valid secret key, otherwise use a pass-through
    authMiddleware = hasValidSecret ? clerkMiddleware() : (req, res, next) => next();
} catch (e) {
    console.warn("Failed to initialize Clerk middleware, bypassing auth:", e.message);
    authMiddleware = (req, res, next) => next();
}

export const clerkAuth = authMiddleware;

export function requireAuth(req, res, next) {
    // If Clerk is misconfigured, let's allow requests in local dev by mocking a user ID
    // so the app still functions without crashing.
    if (!hasValidSecret) {
        console.warn("Clerk Secret Key is invalid (needs to start with sk_). Bypassing auth check.");
        req.clerkUserId = "dev_mock_user_id";
        return next();
    }

    try {
        const auth = getAuth(req);
        if (!auth || !auth.userId) {
            return res.status(401).json({ success: false, message: "Authentication required" });
        }
        req.clerkUserId = auth.userId;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }
}

export { getAuth };
