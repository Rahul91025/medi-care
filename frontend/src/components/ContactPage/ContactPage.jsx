import React, { useState } from "react";
import { Phone, MapPin, Mail, Send, MessageSquare, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import bannerImg from '../../assets/BannerImg.png';

export default function ContactPage() {
  const initial = { name: "", email: "", phone: "", department: "", service: "", message: "" };
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const departments = ["General Physician", "Cardiology", "Orthopedics", "Dermatology", "Pediatrics", "Gynecology"];

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "10 digits required";
    if (!form.message.trim()) e.message = "Message is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: undefined }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const text = `*Contact Request*\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nDepartment: ${form.department || "N/A"}\nMessage: ${form.message}`;
    window.open(`https://wa.me/8299431275?text=${encodeURIComponent(text)}`, "_blank");
    setForm(initial);
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  }

  const inputClasses = "w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 focus:bg-white transition-all placeholder:text-slate-400";

  return (
    <div className="min-h-screen bg-white pt-36 pb-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Premium Header Banner */}
        <div className="relative w-full h-[300px] md:h-[400px] rounded-[3rem] overflow-hidden mb-20 shadow-2xl border border-slate-100 flex items-center justify-center group text-center px-6">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent z-10" />
          <img
            src={bannerImg}
            alt="Contact Premium Support"
            className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-700"
          />
          <div className="relative z-20 text-white max-w-3xl translate-y-4">
            <h2 className="text-sm font-bold tracking-widest text-emerald-400 uppercase mb-4 drop-shadow-md">Get in Touch</h2>
            <h1 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tight mb-6 drop-shadow-lg">
              Contact Us.
            </h1>
            <p className="text-lg md:text-xl text-slate-200 font-medium leading-relaxed drop-shadow">
              Have a question or need assistance? We're here to help. Reach out and our team will respond promptly to ensure you receive the best care.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3 glass-card rounded-[2.5rem] p-10 md:p-12"
          >
            {sent && (
              <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-sm font-semibold flex items-center gap-2">
                <Send className="w-5 h-5" /> Message sent via WhatsApp!
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={inputClasses} />
                {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Email Address</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClasses} />
                {errors.email && <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Phone Number</label>
                  <input name="phone" type="tel" maxLength="10" value={form.phone} onChange={handleChange} placeholder="1234567890" className={inputClasses} />
                  {errors.phone && <p className="text-red-500 text-xs mt-2 font-medium">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">Department</label>
                  <select name="department" value={form.department} onChange={handleChange} className={inputClasses}>
                    <option value="">Select Department</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Your Message</label>
                <textarea name="message" rows={4} value={form.message} onChange={handleChange} placeholder="How can we help you?" className={`${inputClasses} resize-none`} />
                {errors.message && <p className="text-red-500 text-xs mt-2 font-medium">{errors.message}</p>}
              </div>
              <button type="submit" className="group w-full py-5 bg-slate-900 text-white rounded-2xl font-semibold text-lg hover:bg-primary-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5">
                <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Send via WhatsApp
              </button>
            </form>
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {/* Contact Info */}
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex-1">
              <h3 className="text-2xl font-heading font-bold mb-8">Contact Information</h3>
              <div className="space-y-6">
                {[
                  { icon: Phone, label: "Phone", value: "+91 82994 31275" },
                  { icon: Mail, label: "Email", value: "info@medicare.com" },
                  { icon: MapPin, label: "Location", value: "Gomti Nagar, Lucknow, UP" }
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-5 group">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary-600 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
                      <p className="text-lg font-semibold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.460792853461!2d80.98709187529213!3d26.870382662861033!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2ae3cea2421%3A0x6c0de12e8a77818f!2sGomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1731769000000!5m2!1sen!2sin"
                title="Location"
                className="w-full h-full"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}