import React, { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, UserRound, ArrowRight, ShieldCheck, Star } from "lucide-react";
import d1 from '../../assets/D1.png';
import d2 from '../../assets/D2.png';
import d3 from '../../assets/D3.png';

const fallbackImages = [d1, d2, d3];

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function ListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchDoctors() {
    try {
      const res = await axios.get(`${API_BASE}/api/doctors`);
      setDoctors(res.data?.data || res.data?.doctors || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

  async function removeDoctor(id) {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`${API_BASE}/api/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => (d._id || d.id) !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete doctor");
    }
  }

  if (loading) return <div className="p-8"><div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">Medical Team</span>
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Our Specialists</h1>
        <p className="text-sm text-slate-500 mt-1">Manage and review your elite medical team.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {doctors.map((doctor, index) => {
          const fallbackImg = fallbackImages[index % fallbackImages.length];
          const hasImage = doctor.imageUrl || doctor.image;

          return (
            <div key={doctor._id || doctor.id} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-emerald-100/50 overflow-hidden group hover:-translate-y-2 transition-all duration-500 relative flex flex-col">

              {/* Premium Image Container */}
              <div className="h-56 w-full relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent z-10" />
                {hasImage ? (
                  <img
                    src={doctor.imageUrl || doctor.image}
                    alt={doctor.name}
                    className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.src = fallbackImg; }}
                  />
                ) : (
                  <img
                    src={fallbackImg}
                    alt="Abstract Medical Placeholder"
                    className="w-full h-full object-cover absolute inset-0 opacity-80 mix-blend-multiply group-hover:scale-110 transition-transform duration-700"
                  />
                )}

                {/* Availability Badge Overlay */}
                <div className="absolute top-4 right-4 z-20">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg backdrop-blur-md border ${doctor.availability === "Available" ? "bg-emerald-500/90 text-white border-emerald-400/50" : "bg-red-500/90 text-white border-red-400/50"}`}>
                    <span className={`w-2 h-2 rounded-full ${doctor.availability === "Available" ? "bg-emerald-200 animate-pulse" : "bg-red-200"}`} />
                    {doctor.availability || "Available"}
                  </span>
                </div>
              </div>

              {/* Content Container */}
              <div className="p-6 flex-1 flex flex-col bg-white z-20 relative">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-2">
                      {doctor.name}
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </h3>
                    <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full mt-2">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="fill-current w-4 h-4" />
                    <Star className="fill-current w-4 h-4" />
                    <Star className="fill-current w-4 h-4" />
                    <Star className="fill-current w-4 h-4" />
                    <Star className="fill-current w-4 h-4 opacity-40 text-slate-300" />
                  </div>
                  <button
                    onClick={() => removeDoctor(doctor._id || doctor.id)}
                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-500 rounded-full bg-slate-50 transition-all shadow-sm group-hover:shadow-md"
                    title="Remove Specialist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {doctors.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <UserRound className="w-8 h-8 text-emerald-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Specialists Found</h3>
            <p className="text-slate-500 mt-2 max-w-sm">You haven't added any doctors to the platform yet. Click "Add Doctor" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}