import React, { useState, useEffect, useMemo } from "react";
import { CalendarDays, Clock, CreditCard, Stethoscope, FlaskConical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { cn } from "../../utils";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
const API = axios.create({ baseURL: API_BASE });

function pad(n) { return String(n ?? 0).padStart(2, "0"); }

function computeStatus(item) {
  if (!item) return "Pending";
  if (item.status === "Canceled") return "Canceled";
  if (item.status === "Completed") return "Completed";
  if (item.status === "Confirmed") return "Confirmed";
  if (item.status === "Rescheduled") return "Rescheduled";
  return item.status || "Pending";
}

const statusStyles = {
  Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Canceled: "bg-red-50 text-red-600 border-red-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Rescheduled: "bg-blue-50 text-blue-700 border-blue-200",
};

export default function AppointmentPage() {
  const [doctorAppts, setDoctorAppts] = useState([]);
  const [serviceAppts, setServiceAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("doctors");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [docRes, svcRes] = await Promise.allSettled([
          API.get("/api/appointments"),
          API.get("/api/service-appointments"),
        ]);
        if (docRes.status === "fulfilled") {
          const data = docRes.value?.data?.data || docRes.value?.data?.appointments || [];
          setDoctorAppts(Array.isArray(data) ? data : []);
        }
        if (svcRes.status === "fulfilled") {
          const data = svcRes.value?.data?.data || svcRes.value?.data?.appointments || [];
          setServiceAppts(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const doctorData = useMemo(() => doctorAppts.map((a) => ({
    id: a._id || a.id,
    doctor: a.doctorName || "Doctor",
    patient: a.patientName || "Patient",
    specialization: a.speciality || a.specialization || "",
    date: a.date || "",
    time: a.time || "",
    payment: a.payment?.method || "Cash",
    status: computeStatus(a),
    fee: a.fees || 0,
  })), [doctorAppts]);

  const serviceData = useMemo(() => serviceAppts.map((s) => ({
    id: s._id || s.id,
    name: s.serviceName || "Service",
    patient: s.patientName || "Patient",
    date: s.date || "",
    time: s.hour !== undefined ? `${s.hour}:${pad(s.minute)} ${s.ampm || ""}` : "",
    payment: s.payment?.method || "Cash",
    status: computeStatus(s),
    price: s.fees || 0,
  })), [serviceAppts]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
    </div>
  );

  const AppointmentCard = ({ item, type }) => {
    const status = item.status;
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center shrink-0 text-emerald-600">
            {type === "doctor" ? <Stethoscope className="w-8 h-8" /> : <FlaskConical className="w-8 h-8" />}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900 mb-1">{type === "doctor" ? item.doctor : item.name}</h3>
            <p className="text-sm text-slate-500 font-medium mb-3">
              {type === "doctor" ? `${item.specialization} • ` : ""}Patient: {item.patient}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-500">
              <span className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-slate-400" /> {item.date || "—"}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" /> {item.time || "—"}
              </span>
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" /> {item.payment}
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex sm:flex-col items-center sm:items-end gap-3">
            <span className="text-2xl font-black text-slate-900">₹{type === "doctor" ? item.fee : item.price}</span>
            <span className={cn(
              "text-xs px-4 py-2 rounded-full font-bold uppercase tracking-wider border",
              statusStyles[status] || statusStyles.Pending
            )}>
              {status}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white pt-36 pb-32 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-4">Dashboard</h2>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-4">
            My Appointments.
          </h1>
          <p className="text-xl text-slate-500 font-medium">Track and manage all your healthcare bookings in one place.</p>
        </div>

        {error && (
          <div className="mb-8 p-6 bg-red-50/50 rounded-2xl border border-red-100 text-red-600 font-medium">{error}</div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-3 mb-12">
          {[
            { key: "doctors", label: "Doctor Appointments", count: doctorData.length, icon: Stethoscope },
            { key: "services", label: "Service Bookings", count: serviceData.length, icon: FlaskConical }
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-full text-base font-semibold transition-all duration-300",
                tab === t.key
                  ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                  : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
              )}
            >
              <t.icon className="w-5 h-5" />
              {t.label}
              <span className={cn(
                "text-xs px-2.5 py-1 rounded-full font-bold",
                tab === t.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              )}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {tab === "doctors" && (
              <>
                {doctorData.length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg font-medium">No doctor appointments yet.</p>
                  </div>
                )}
                {doctorData.map((a) => <AppointmentCard key={a.id} item={a} type="doctor" />)}
              </>
            )}

            {tab === "services" && (
              <>
                {serviceData.length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <FlaskConical className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg font-medium">No service bookings yet.</p>
                  </div>
                )}
                {serviceData.map((s) => <AppointmentCard key={s.id} item={s} type="service" />)}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
