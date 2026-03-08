import React, { useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils";

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Cardiologist", rating: 5, text: "The appointment booking system is incredibly efficient. It saves me valuable time and helps me focus on patient care. The interface is beautifully designed and intuitive.", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80" },
    { id: 2, name: "Michael Chen", role: "Patient", rating: 5, text: "Scheduling appointments has never been easier. The interface is intuitive and reminders are very helpful! I've recommended MediCare to all my friends and family.", image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=400&q=80" },
    { id: 3, name: "Dr. Robert Martinez", role: "Pediatrician", rating: 5, text: "This platform has streamlined our clinic operations significantly. Patient management is much more organized and we've seen a 40% reduction in no-shows.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" },
    { id: 4, name: "Emily Williams", role: "Patient", rating: 5, text: "Booking appointments online 24/7 is a game-changer. The confirmation system gives me peace of mind. I love how clean and modern the platform feels.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80" },
    { id: 5, name: "Dr. Amanda Lee", role: "Dermatologist", rating: 5, text: "Excellent platform for managing appointments. Automated reminders reduce no-shows dramatically. The analytics dashboard is incredibly useful for our practice.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80" },
    { id: 6, name: "David Thompson", role: "Patient", rating: 5, text: "The wait time has reduced significantly since using this platform. Very convenient and user-friendly! The entire experience feels premium and trustworthy.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
  ];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={cn("w-5 h-5", i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200")} />
    ));

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-50/60 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-sm font-bold tracking-widest text-emerald-600 uppercase mb-4">Testimonials</h2>
          <p className="text-4xl md:text-5xl font-heading font-black text-slate-900 tracking-tight">
            Loved by <span className="text-gradient-pro">Thousands.</span>
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="max-w-5xl mx-auto mb-20">
          <div className="relative ultra-glass rounded-[3rem] p-12 md:p-20 shadow-[-10px_-10px_30px_4px_rgba(255,255,255,0.8),10px_10px_30px_4px_rgba(20,83,45,0.05)]">
            <Quote className="absolute top-8 left-10 w-16 h-16 text-emerald-100" />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <div className="flex gap-1 mb-8">{renderStars(testimonials[activeIndex].rating)}</div>
                <p className="text-3xl md:text-4xl text-slate-800 font-medium leading-relaxed mb-12 italic tracking-tight">
                  "{testimonials[activeIndex].text}"
                </p>
                <div className="flex items-center gap-6">
                  <img
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-lg"
                  />
                  <div>
                    <h4 className="text-xl font-bold text-slate-900">{testimonials[activeIndex].name}</h4>
                    <p className="text-base font-medium text-slate-500">{testimonials[activeIndex].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center gap-3 absolute bottom-10 right-10 md:right-16">
              <button
                onClick={prev}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mini Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.filter((_, i) => i !== activeIndex).slice(0, 3).map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveIndex(testimonials.findIndex(item => item.id === t.id))}
              className="group cursor-pointer bento-card p-10 hover-lift-pro"
            >
              <div className="flex gap-0.5 mb-4">{renderStars(t.rating)}</div>
              <p className="text-slate-600 font-medium leading-relaxed mb-6 line-clamp-3">"{t.text}"</p>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                <img src={t.image} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{t.name}</h4>
                  <p className="text-sm font-medium text-slate-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots indicator */}
        <div className="flex items-center justify-center gap-2 mt-12">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "rounded-full transition-all duration-500",
                i === activeIndex ? "w-10 h-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "w-3 h-3 bg-slate-300 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}