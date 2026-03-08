import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  Calendar,
  BriefcaseMedical,
  Stethoscope,
  ClipboardList,
  Activity,
  ChevronRight
} from "lucide-react";

const navSections = [
  {
    title: "Doctors",
    items: [
      { name: "Dashboard", to: "/h", icon: LayoutDashboard },
      { name: "Add Doctor", to: "/add", icon: UserPlus },
      { name: "Doctor List", to: "/list", icon: Users },
      { name: "Appointments", to: "/appointments", icon: Calendar },
    ],
  },
  {
    title: "Services",
    items: [
      { name: "Overview", to: "/service-dashboard", icon: BriefcaseMedical },
      { name: "Add Service", to: "/add-service", icon: Stethoscope },
      { name: "Service List", to: "/list-service", icon: ClipboardList },
      { name: "Bookings", to: "/service-appointments", icon: Calendar },
    ],
  },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <aside className="w-[260px] bg-white border-r border-slate-100 flex flex-col hidden md:flex min-h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100">
        <Link to="/h" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white" style={{ boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)' }}>
            <Activity size={18} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <span className="text-[15px] font-heading font-extrabold tracking-tight text-slate-900 leading-none">
              MediCare
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-[0.15em] uppercase leading-none mt-0.5">
              Admin Panel
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="px-3 mb-2 text-[10px] font-bold text-slate-400 tracking-[0.12em] uppercase">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = location.pathname === item.to;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${active
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                  >
                    <Icon
                      size={18}
                      className={`flex-shrink-0 transition-colors ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"
                        }`}
                    />
                    <span className="flex-1">{item.name}</span>
                    {active && (
                      <ChevronRight size={14} className="text-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
            <Activity size={14} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-700 leading-none">System Status</p>
            <p className="text-[10px] text-emerald-600 font-medium mt-0.5">All services running</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
