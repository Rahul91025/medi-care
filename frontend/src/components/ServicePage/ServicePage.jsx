import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { cn } from "../../utils";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function ServicePage({ previewCount }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/services`);
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error((json && json.message) || `Failed (${res.status})`);
        const items = json?.data || json?.services || json || [];
        const normalized = (Array.isArray(items) ? items : []).map((s) => ({
          id: s._id || s.id,
          name: s.name || "Service",
          image: s.imageUrl || s.image || "",
          price: s.price ?? 0,
          about: s.about || s.shortDescription || "",
          available: s.available !== false,
        }));
        if (mounted) setServices(normalized);
      } catch (err) {
        if (mounted) setError(err.message || "Network error");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  const display = previewCount ? services.slice(0, previewCount) : services;
  const isPreview = !!previewCount;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className={cn("px-6 bg-white relative", isPreview ? "py-32" : "pt-40 pb-32")}>
      {isPreview && <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />}

      <div className="max-w-7xl mx-auto">
        <div className={cn("mb-20", isPreview ? "flex flex-col md:flex-row md:items-end justify-between gap-8" : "text-center")}>
          <div className={cn(isPreview ? "max-w-2xl" : "max-w-3xl mx-auto")}>
            {!isPreview && <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-4">Our Expertise</h2>}
            <h2 className={cn("font-heading font-extrabold text-slate-900 tracking-tight leading-tight mb-6", isPreview ? "text-4xl md:text-5xl" : "text-4xl md:text-5xl")}>
              {isPreview ? <>World-Class <br className="hidden md:block" />Services.</> : "All Services"}
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              Comprehensive healthcare services delivered with precision, powered by cutting-edge medical technology and compassionate expertise.
            </p>
          </div>
          {isPreview && (
            <Link to="/services" className="group hidden md:inline-flex items-center gap-3 px-8 py-4 rounded-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300">
              View All
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          )}
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-center py-12 bg-red-50/50 rounded-3xl border border-red-100">
            <p className="text-red-500 mb-4 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition">Retry</button>
          </div>
        )}

        {!loading && !error && (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className={cn("grid gap-8", isPreview ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}
            >
              {display.map((svc) => (
                <motion.div key={svc.id} variants={itemVariants}>
                  <Link
                    to={`/services/${svc.id}`}
                    className="group block bento-card hover-lift-pro"
                  >
                    <div className={cn("relative bg-slate-100 overflow-hidden", isPreview ? "h-52" : "h-60")}>
                      {svc.image ? (
                        <img src={svc.image} alt={svc.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center">
                          <Sparkles className="w-12 h-12 text-emerald-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Status */}
                      <div className="absolute top-4 left-4">
                        <span className={cn(
                          "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm",
                          svc.available ? "bg-emerald-500/90 text-white" : "bg-slate-800/90 text-white"
                        )}>
                          {svc.available ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      <div className="absolute bottom-4 right-4 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl">
                          <ArrowUpRight className="w-6 h-6 text-slate-900" />
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{svc.name}</h3>
                      <p className="text-sm text-slate-500 line-clamp-2 mb-4 font-medium leading-relaxed">{svc.about}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-2xl font-black text-slate-900">₹{svc.price}</span>
                        <span className="text-sm font-semibold text-primary-600 group-hover:underline">Learn More →</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {isPreview && services.length > previewCount && (
              <div className="text-center mt-16 md:hidden">
                <Link to="/services" className="inline-flex items-center justify-center w-full px-8 py-5 rounded-full bg-slate-900 text-white font-semibold text-lg hover:bg-primary-600 transition-colors shadow-lg">
                  View All Services
                </Link>
              </div>
            )}
            {display.length === 0 && <div className="text-center py-20 text-slate-400 text-lg">No services available at the moment.</div>}
          </>
        )}
      </div>
    </section>
  );
}