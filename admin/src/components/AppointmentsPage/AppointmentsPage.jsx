import React, { useState, useEffect } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Calendar } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchAppointments() {
    try {
      const res = await axios.get(`${API_BASE}/api/appointments`);
      setAppointments(res.data?.data || res.data?.appointments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  async function updateStatus(id, newStatus) {
    try {
      await axios.put(`${API_BASE}/api/appointments/${id}`, { status: newStatus });
      setAppointments(prev => prev.map(a => (a._id || a.id) === id ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert("Failed to update status");
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statusStyles = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-100",
    Canceled: "bg-red-50 text-red-700 border-red-100",
    Confirmed: "bg-blue-50 text-blue-700 border-blue-100",
    Pending: "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Calendar size={14} className="text-emerald-600" />
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">Appointments</span>
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Doctor Appointments</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and track all patient appointments.</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fee</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.map((a) => (
                <tr key={a._id || a.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900 text-[13px]">{a.patientName}</div>
                    {a.patientAge && <div className="text-[11px] text-slate-400 mt-0.5">{a.patientAge} yrs • {a.patientGender}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-800 text-[13px]">{a.doctorName}</div>
                    <div className="text-[11px] text-emerald-600 font-medium mt-0.5">{a.speciality}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-[13px]">
                    <div className="font-medium">{a.date}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{a.time}</div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 text-[13px]">₹{a.fees}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-bold border ${statusStyles[a.status] || statusStyles.Pending}`}>
                      {a.status || "Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {a.status !== "Completed" && a.status !== "Canceled" && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateStatus(a._id || a.id, "Completed")}
                          className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                          title="Mark Completed"
                        >
                          <CheckCircle size={15} />
                        </button>
                        <button
                          onClick={() => updateStatus(a._id || a.id, "Canceled")}
                          className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <XCircle size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-16 text-center text-slate-400 text-sm">No appointments found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
