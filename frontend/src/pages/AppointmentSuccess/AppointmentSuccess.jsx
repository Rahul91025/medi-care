import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@clerk/react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function AppointmentSuccess() {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const navigate = useNavigate();
    const { getToken } = useAuth();

    const [status, setStatus] = useState("verifying"); // verifying, success, error
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!sessionId) {
            setStatus("error");
            setErrorMessage("No payment session ID found. Please contact support.");
            return;
        }

        async function verifyPayment() {
            try {
                const token = await getToken();
                // Backend endpoint expected to handle this confirm
                const res = await fetch(`${API_BASE}/api/appointments/confirm?session_id=${sessionId}`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });

                const data = await res.json().catch(() => null);

                if (!res.ok) {
                    throw new Error(data?.message || `Verification failed (${res.status})`);
                }

                setStatus("success");
            } catch (err) {
                console.error("Payment verification error:", err);
                setStatus("error");
                setErrorMessage(err.message || "Failed to verify payment with the server.");
            }
        }

        verifyPayment();
    }, [sessionId, getToken]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-br from-emerald-100/40 to-teal-100/40 blur-[100px] pointer-events-none" />

            <div className="relative w-full max-w-md bg-white rounded-[2rem] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 text-center">
                {status === "verifying" && (
                    <div className="flex flex-col items-center animate-pulse">
                        <Loader2 className="w-16 h-16 text-emerald-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Verifying Payment</h2>
                        <p className="text-slate-500 font-medium">Please wait while we confirm your booking with the payment provider...</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100/50">
                            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Payment Successful!</h2>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                            Your appointment has been perfectly booked and confirmed. A receipt has been sent to your email.
                        </p>
                        <Link
                            to="/appointments"
                            className="w-full inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors shadow-lg shadow-slate-900/10"
                        >
                            Go to My Appointments
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-red-100/50">
                            <XCircle className="w-10 h-10 text-red-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-3">Payment Failed</h2>
                        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                            {errorMessage}
                        </p>
                        <div className="flex gap-4 w-full">
                            <Link
                                to="/doctors"
                                className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                            >
                                Try Again
                            </Link>
                            <Link
                                to="/contact"
                                className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg"
                            >
                                Support
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
