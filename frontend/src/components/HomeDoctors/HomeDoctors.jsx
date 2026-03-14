import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Award, Clock } from "lucide-react";
import { cn } from "../../utils";

const API_BASE = import.meta.env.VITE_API_BASE || "";

export default function HomeDoctors({ previewCount = 6 }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);
        if (!res.ok) {
          if (!mounted) return;
          setError((json && json.message) || `Failed to load doctors (${res.status})`);
          setDoctors([]);
          setLoading(false);
          return;
        }
        const items = (json && (json.data || json.doctors || json)) || [];
        const normalized = (Array.isArray(items) ? items : []).map((d) => ({
          id: d._id || d.id,
          name: d.name || "Unknown",
          specialization: d.specialization || "",
          image: d.imageUrl || d.image || "",
          experience: d.experience || "",
          fee: d.fee ?? d.price ?? 0,
          available: d.availability === "Available" || d.available === true,
        }));
        if (!mounted) return;
        setDoctors(normalized);
      } catch (err) {
        if (!mounted) return;
        setError("Network error while loading doctors.");
        setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const preview = doctors.slice(0, previewCount);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className="py-32 px-6 bg-white relative z-20">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Elite Medical <br className="hidden md:block" /> Professionals.
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Our curated selection of top-tier specialists ensures you receive the highest standard of care, tailored precisely to your unique health profile.
            </p>
          </div>
          <Link
            to="/doctors"
            className="group hidden md:inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
          >
            Explore Directory
            <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-12 bg-red-50/50 rounded-3xl border border-red-100">
            <p className="text-red-500 mb-4 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition shadow-sm">
              Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {preview.map((doctor) => (
              <motion.div key={doctor.id} variants={itemVariants}>
                <Link
                  to={`/doctors/${doctor.id}`}
                  className="group block bento-card p-5 hover-lift-pro"
                >
                  {/* Status Badge */}
                  <div className="absolute top-8 right-8 z-10">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm",
                      doctor.available ? "bg-emerald-500/90 text-white" : "bg-slate-800/90 text-white"
                    )}>
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        doctor.available ? "bg-white animate-pulse" : "bg-red-500"
                      )} />
                      {doctor.available ? "Online" : "Away"}
                    </span>
                  </div>

                  <div className="relative h-80 rounded-[1.5rem] bg-slate-100 mb-6 overflow-hidden">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-6xl font-heading font-bold text-slate-300">
                        {doctor.name.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute bottom-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold shadow-2xl">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 pb-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-1.5 group-hover:text-primary-600 transition-colors">{doctor.name}</h3>
                        <p className="text-base font-semibold text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full">{doctor.specialization}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Fee</span>
                        <span className="text-xl font-black text-slate-900">₹{doctor.fee}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-5 text-sm font-medium text-slate-500 pt-5 border-t border-slate-100">
                      {doctor.experience && (
                        <span className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-slate-400" /> {doctor.experience} Exp.
                        </span>
                      )}
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-slate-400" /> Available Today
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && doctors.length > previewCount && (
          <div className="mt-20 text-center md:hidden">
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center gap-2 w-full px-8 py-5 rounded-full bg-slate-900 text-white font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg"
            >
              View All Specialists
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
