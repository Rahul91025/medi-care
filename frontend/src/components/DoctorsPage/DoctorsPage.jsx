import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight, Award, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../utils";
import d1 from '../../assets/D1.png';
import d2 from '../../assets/D2.png';
import d3 from '../../assets/D3.png';

const fallbackImages = [d1, d2, d3];

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error((json && json.message) || `Failed (${res.status})`);
        const items = json?.data || json?.doctors || json || [];
        const normalized = (Array.isArray(items) ? items : []).map((d) => ({
          id: d._id || d.id,
          name: d.name || "Unknown",
          specialization: d.specialization || "",
          image: d.imageUrl || d.image || "",
          experience: d.experience || "",
          fee: d.fee ?? d.price ?? 0,
          available: d.availability === "Available" || d.available === true,
          about: d.about || "",
          location: d.location || "",
        }));
        if (mounted) setDoctors(normalized);
      } catch (err) {
        if (mounted) setError(err.message || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const filtered = doctors.filter((d) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q);
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.06 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="min-h-screen bg-white pt-36 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-4">Our Team</h2>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-6">
            Find Your Specialist.
          </h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Browse our curated directory of elite medical professionals and book your appointment in seconds.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-20">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or specialization..."
              className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all duration-300 font-medium placeholder:text-slate-400"
            />
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-center py-12 bg-red-50/50 rounded-3xl border border-red-100">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filtered.map((doctor, index) => {
              const fallbackImg = fallbackImages[index % fallbackImages.length];
              return (
                <motion.div key={doctor.id} variants={itemVariants}>
                  <Link
                    to={`/doctors/${doctor.id}`}
                    className="group block bg-white rounded-[2rem] p-4 border border-slate-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute top-8 right-8 z-10">
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border",
                        doctor.available ? "bg-emerald-500/90 text-white border-emerald-400/50" : "bg-red-500/90 text-white border-red-400/50"
                      )}>
                        <span className={cn("w-2 h-2 rounded-full", doctor.available ? "bg-emerald-200 animate-pulse" : "bg-red-200")} />
                        {doctor.available ? "Online" : "Away"}
                      </span>
                    </div>

                    <div className="relative h-64 rounded-[1.5rem] bg-gradient-to-br from-emerald-50 to-teal-50 mb-5 overflow-hidden">
                      {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.src = fallbackImg; }} />
                      ) : (
                        <img src={fallbackImg} alt="Abstract Medical Placeholder" className="w-full h-full object-cover opacity-80 mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <ArrowUpRight className="w-5 h-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>

                    <div className="px-3 pb-3">
                      <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">{doctor.name}</h3>
                      <p className="text-sm font-semibold text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full mb-3">{doctor.specialization}</p>
                      <div className="flex items-center justify-between text-sm font-medium text-slate-500 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                          {doctor.experience && (
                            <span className="flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-slate-400" /> {doctor.experience}
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-black text-slate-900">₹{doctor.fee}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full text-center py-20">
                <p className="text-slate-400 text-lg font-medium">No doctors match your search.</p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
