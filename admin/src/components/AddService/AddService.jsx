import React, { useState } from "react";
import axios from "axios";
import { Stethoscope } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function AddService() {
  const [form, setForm] = useState({ name: "", shortDescription: "", about: "", price: "" });
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

      await axios.post(`${API_BASE}/api/services`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage({ text: "Service added successfully!", type: "success" });
      setForm({ name: "", shortDescription: "", about: "", price: "" });
      setImage(null);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || err.message || "Failed to add service", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Stethoscope size={14} className="text-emerald-600" />
          <span className="text-[11px] font-semibold text-emerald-600 tracking-wide uppercase">New Service</span>
        </div>
        <h1 className="text-2xl font-heading font-extrabold text-slate-900 tracking-tight">Add New Service</h1>
        <p className="text-sm text-slate-500 mt-1">Register a new medical service to the platform.</p>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-xl border font-medium flex items-center gap-3 text-sm ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"}`}>
          <div className={`w-2 h-2 rounded-full ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 sm:p-8 space-y-6" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div className="flex flex-col">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Service Image</label>
          <label htmlFor="srv-img" className="cursor-pointer group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 hover:border-emerald-300 transition-colors flex items-center justify-center">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl text-slate-300 group-hover:text-emerald-400 transition-colors">📸</span>
              )}
            </div>
          </label>
          <input type="file" id="srv-img" accept="image/*" hidden onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Service Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400" placeholder="e.g. Full Body Checkup" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Price (₹)</label>
          <input type="number" name="price" value={form.price} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400" placeholder="500" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">Short Description</label>
          <input type="text" name="shortDescription" value={form.shortDescription} onChange={handleChange} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-slate-400" placeholder="Brief summary of this service" />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-2">About (Detailed)</label>
          <textarea name="about" value={form.about} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white transition-all resize-none placeholder:text-slate-400" placeholder="Detailed description of the service..."></textarea>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-[0.97]" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            {loading ? "Adding..." : "Add Service"}
          </button>
        </div>
      </form>
    </div>
  );
}
