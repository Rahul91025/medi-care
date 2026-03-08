import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Certification() {
  const certifications = [
    { id: 1, name: "Medical Commission", type: "international" },
    { id: 2, name: "Government Approved", type: "government" },
    { id: 3, name: "NABH Accredited", type: "healthcare" },
    { id: 4, name: "Medical Council", type: "government" },
    { id: 5, name: "Quality Healthcare", type: "healthcare" },
    { id: 6, name: "Paramedical Council", type: "healthcare" },
    { id: 7, name: "Ministry of Health", type: "government" },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60 overflow-hidden relative z-10">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-gradient-to-r from-emerald-100/50 via-teal-50/50 to-primary-100/50 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
        <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-4">Recognized Excellence</h2>
        <p className="text-3xl md:text-4xl font-heading font-bold text-slate-800 tracking-tight">Accredited by Global Authorities</p>
      </div>

      <div className="relative flex overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

        <div className="flex animate-scroll whitespace-nowrap py-4">
          {[...certifications, ...certifications, ...certifications].map((cert, i) => (
            <div
              key={`${cert.id}-${i}`}
              className="group/badge flex-shrink-0 w-72 mx-4 bg-white/70 backdrop-blur-xl rounded-[1.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:bg-white hover:-translate-y-1.5 transition-all duration-300 flex items-center p-5 gap-5"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover/badge:scale-110 group-hover/badge:rotate-3 group-hover/badge:bg-emerald-100 transition-all duration-300 shadow-sm">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="text-left overflow-hidden">
                <p className="text-base font-bold text-slate-900 truncate mb-1">{cert.name}</p>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{cert.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-33.33333%); } }
        .animate-scroll { animation: scroll 40s linear infinite; width: max-content; }
        .group:hover .animate-scroll { animation-play-state: paused; }
      `}</style>
    </section>
  );
}