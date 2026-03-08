import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, ClipboardList } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function ListServicePage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchServices() {
    try {
      const res = await axios.get(`${API_BASE}/api/services`);
      setServices(res.data?.data || res.data?.services || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchServices(); }, []);

  async function removeService(id) {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`${API_BASE}/api/services/${id}`);
      setServices((prev) => prev.filter((s) => (s._id || s.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-[3px] border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <ClipboardList size={14} className="text-emerald-600" />
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">Catalog</span>
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Service List</h1>
        <p className="text-sm text-slate-500 mt-1">Manage all medical services on the platform.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((service) => (
          <div key={service._id || service.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:border-slate-200 p-5 group" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
            <div className="flex items-start gap-3.5 mb-4">
              {service.imageUrl || service.image ? (
                <img src={service.imageUrl || service.image} alt={service.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" onError={(e) => { e.currentTarget.style.display = "none"; }} />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl flex-shrink-0">🏥</div>
              )}
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 text-[15px] leading-tight">{service.name}</h3>
                <div className="text-sm font-bold text-emerald-600 mt-1">₹{service.price}</div>
              </div>
            </div>

            <p className="text-[13px] text-slate-500 line-clamp-2 mb-4 leading-relaxed">{service.about || service.shortDescription}</p>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border ${service.available !== false ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${service.available !== false ? "bg-emerald-500" : "bg-red-500"}`} />
                {service.available !== false ? "Available" : "Unavailable"}
              </span>
              <button onClick={() => removeService(service._id || service.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="Delete">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {services.length === 0 && <div className="col-span-full py-16 text-center text-slate-400 text-sm">No services found.</div>}
      </div>
    </div>
  );
}
