import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, Calendar, TrendingUp, ArrowUpRight, Activity } from "lucide-react";
import bannerImg from "../../assets/admin_dashboard_banner.png";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function DashboardPage() {
  const [stats, setStats] = useState({ doctors: 0, appointments: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const docRes = await axios.get(`${API_BASE}/api/doctors`);
        const appRes = await axios.get(`${API_BASE}/api/appointments`);

        const docCount = docRes.data?.data?.length || docRes.data?.length || 0;
        const appts = appRes.data?.data || appRes.data?.appointments || [];

        const rev = appts.reduce((sum, current) => {
          if (current && current.payment && current.payment.status === "Paid") {
            return sum + (Number(current.fees) || 0);
          }
          return sum;
        }, 0);

        setStats({ doctors: docCount, appointments: appts.length, revenue: rev });
      } catch (err) {
        console.error("Dashboard error", err);
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
    {
      label: "Total Doctors",
      value: stats.doctors,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      change: "+12%",
    },
    {
      label: "Appointments",
      value: stats.appointments,
      icon: Calendar,
      color: "emerald",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      change: "+24%",
    },
    {
      label: "Revenue (Paid)",
      value: `₹${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "violet",
      bgColor: "bg-violet-50",
      iconColor: "text-violet-600",
      change: "+18%",
    },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">Live Dashboard</span>
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Welcome back</h1>
        <p className="text-sm text-slate-500 mt-1">Here's an overview of your system performance.</p>
      </div>

      {/* Banner */}
      <div className="relative w-full h-[200px] rounded-2xl overflow-hidden mb-8 group border border-slate-100" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-transparent z-10" />
        <img
          src={bannerImg}
          alt="Admin Dashboard"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xl flex items-center justify-center border border-white/20">
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-heading font-bold text-lg leading-none">MediCare Admin</p>
            <p className="text-white/60 text-xs font-medium mt-0.5">System overview & analytics</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-2xl border border-slate-100 flex items-center gap-4 transition-all duration-300 hover:border-slate-200 group"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}
            >
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