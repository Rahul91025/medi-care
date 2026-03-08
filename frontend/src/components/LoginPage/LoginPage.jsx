import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Activity, ArrowRight, Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const STORAGE_KEY = "docToken";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { setError("Email and password are required"); return; }
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/doctors/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) { setError(json?.message || "Login failed"); setBusy(false); return; }
      const token = json?.token || json?.data?.token;
      const doctorId = json?.data?._id || json?.doctor?._id || json?.data?.id;
      if (!token || !doctorId) { setError("Invalid response from server"); setBusy(false); return; }
      localStorage.setItem(STORAGE_KEY, token);
      navigate(`/doctor-admin/${doctorId}`);
    } catch (err) {
      setError("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-mesh" />
      <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-200/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-teal-200/20 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl">
          {/* Logo */}
          <div className="flex items-center justify-center mb-10">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-primary-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Activity size={28} />
              </div>
              <span className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                MediCare<span className="text-primary-500">.</span>
              </span>
            </Link>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-heading font-extrabold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500 font-medium">Sign in to access your doctor dashboard</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all"
                  placeholder="doctor@medicare.com"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="group w-full py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg hover:bg-primary-600 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-slate-900/10 hover:shadow-primary-500/25 hover:-translate-y-0.5"
            >
              {busy ? "Signing in..." : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}