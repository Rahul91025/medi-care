import React, { useState, useEffect } from "react";
import axios from "axios";
import { BriefcaseMedical, Calendar, TrendingUp, ArrowUpRight } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function ServiceDashboard() {
  const [stats, setStats] = useState({ services: 0, appointments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const srvRes = await axios.get(`${API_BASE}/api/services`);
        const appRes = await axios.get(`${API_BASE}/api/service-appointments`);

        const srvCount = srvRes.data?.data?.length || srvRes.data?.length || 0;
        const appts = appRes.data?.data || appRes.data?.appointments || [];

        const rev = appts.reduce((sum, current) => {
          if (current && current.payment && current.payment.status === "Paid") {
            return sum + (Number(current.fees) || 0);
          }
          return sum;
        }, 0);

        setStats({ services: srvCount, appointments: appts.length, revenue: rev });
      } catch (err) {
        console.error("Service Dashboard error", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const statCards = [
    { label: "Total Services", value: stats.services, icon: BriefcaseMedical, bgColor: "bg-blue-50", iconColor: "text-blue-600", change: "+8%" },
    { label: "Service Bookings", value: stats.appointments, icon: Calendar, bgColor: "bg-emerald-50", iconColor: "text-emerald-600", change: "+15%" },
    { label: "Revenue (Paid)", value: `₹${stats.revenue.toLocaleString()}`, icon: TrendingUp, bgColor: "bg-violet-50", iconColor: "text-violet-600", change: "+22%" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BriefcaseMedical size={14} className="text-emerald-600" />
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">Services</span>
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Service Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Overview of service performance and bookings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 transition-all duration-300 hover:border-slate-200 group" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <div className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={20} className={stat.iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                <p className="text-xl font-heading font-extrabold text-slate-900 leading-tight mt-0.5">{stat.value}</p>
              </div>
              <div className="flex items-center gap-0.5 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={12} />
                <span className="text-[10px] font-bold">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
