import React, { useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function AddPage() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", specialization: "General physician",
    experience: "1 Year", fee: "", about: "", location: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const formData = new FormData();
      Object.keys(form).forEach(key => formData.append(key, form[key]));
      if (image) formData.append("image", image);

      await axios.post(`${API_BASE}/api/doctors`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage({ text: "Doctor added successfully!", type: "success" });
      setForm({
        name: "", email: "", password: "", specialization: "General physician",
        experience: "1 Year", fee: "", about: "", location: ""
      });
      setImage(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message || "Failed to add doctor", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">New Registration</span>
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Add New Specialist</h1>
        <p className="text-sm text-slate-500 mt-1">Register a new medical professional to your platform.</p>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-2xl shadow-sm border font-medium flex items-center gap-3 ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
          <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-emerald-100/50 p-8 sm:p-10 space-y-8 relative overflow-hidden">
        {/* Floating gradient background decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-emerald-50/50 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-slate-100 pb-8">
          <label htmlFor="doc-img" className="cursor-pointer group flex flex-col items-center shrink-0">
            <div className="relative w-32 h-32 rounded-[2rem] overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-dashed border-emerald-200 group-hover:border-emerald-400 group-hover:shadow-lg transition-all duration-300 flex items-center justify-center">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-4xl transform group-hover:scale-110 transition-transform text-emerald-300">📸</div>
              )}
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm font-semibold">Replace</span>
              </div>
            </div>
            <span className="text-sm font-medium text-emerald-600 mt-3 bg-emerald-50 px-3 py-1 rounded-full group-hover:bg-emerald-100 transition-colors">Upload Photo</span>
          </label>
          <input type="file" id="doc-img" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />

          <div className="flex-1 w-full sm:w-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Doctor Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400" placeholder="e.g. Dr. Richard James" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400" placeholder="doctor@example.com" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400" placeholder="Secure password" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Location / Clinic</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400" placeholder="e.g. New York Core Clinic" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Specialization</label>
            <div className="relative">
              <select name="specialization" value={form.specialization} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer">
                {["General physician", "Gynecologist", "Dermatologist", "Pediatricians", "Neurologist", "Gastroenterologist"].map(spec => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Experience</label>
              <div className="relative">
                <select name="experience" value={form.experience} onChange={handleChange} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium appearance-none cursor-pointer">
                  {Array.from({ length: 15 }, (_, i) => `${i + 1} Year${i > 0 ? 's' : ''}`).map(exp => (
                    <option key={exp} value={exp}>{exp}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Consultation Fee</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input type="number" name="fee" value={form.fee} onChange={handleChange} required className="w-full pl-9 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium placeholder:text-slate-400" placeholder="500" />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full mb-8">
          <label className="block text-sm font-bold text-slate-700 mb-2">About Platform Role / Biography</label>
          <textarea name="about" value={form.about} onChange={handleChange} rows={5} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all font-medium resize-none placeholder:text-slate-400" placeholder="Brief description about the doctor's credentials and expertise..."></textarea>
        </div>

        <div className="relative z-10 pt-4 border-t border-slate-100 flex justify-end">
          <button type="submit" disabled={loading} className="group relative flex items-center justify-center gap-2 px-10 py-4 bg-slate-900 text-white rounded-full font-semibold text-lg overflow-hidden shadow-xl shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/30 w-full sm:w-auto disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="relative z-10 flex items-center gap-2">
              {loading ? "Adding Specialist..." : "Register Specialist"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}
