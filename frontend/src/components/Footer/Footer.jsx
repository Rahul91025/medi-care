import React from "react";
import { Link } from "react-router-dom";
import { Send, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUpRight } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Doctors", href: "/doctors" },
  { name: "Services", href: "/services" },
  { name: "Contact", href: "/contact" },
  { name: "Appointments", href: "/appointments" },
];

const services = [
  { name: "Blood Pressure Check", href: "/services" },
  { name: "Blood Sugar Test", href: "/services" },
  { name: "Full Blood Count", href: "/services" },
  { name: "X-Ray Scan", href: "/services" },
];

const socialLinks = [
  { Icon: Facebook, name: "Facebook", href: "#" },
  { Icon: Twitter, name: "Twitter", href: "#" },
  { Icon: Instagram, name: "Instagram", href: "#" },
  { Icon: Linkedin, name: "LinkedIn", href: "#" },
  { Icon: Youtube, name: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-slate-300 pt-24 pb-12 overflow-hidden border-t-4 border-emerald-500">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        {/* Massive CTA Section */}
        <div className="mb-24 md:flex items-center justify-between border-b border-slate-800 pb-16">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-white tracking-tight mb-4">
              Ready to elevate your <span className="text-gradient-pro">health journey?</span>
            </h2>
            <p className="text-xl text-slate-400 font-medium">
              Join thousands of patients who trust MediCare for their premium wellness needs.
            </p>
          </div>
          <Link to="/appointments" className="group relative shadow-2xl shadow-emerald-500/20 inline-flex items-center justify-center px-10 py-5 rounded-full bg-white text-slate-950 font-bold text-lg hover:bg-emerald-50 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-teal-100 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <span className="relative z-10 flex items-center gap-3">
              Book Appointment <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Info */}
          <div className="lg:col-span-4 pr-0 lg:pr-12">
            <Link to="/" className="inline-block mb-6">
              <span className="text-3xl font-heading font-black tracking-tight text-white group-hover:text-gradient-pro transition-all">
                MediCare<span className="text-emerald-500">.</span>
              </span>
            </Link>
            <p className="text-lg text-slate-400 font-medium leading-relaxed mb-8">
              A trusted, ultra-premium healthcare platform connecting discerning patients with elite medical professionals seamlessly.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, name, href }) => (
                <a key={name} href={href} className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500 hover:bg-emerald-500/10 transition-all duration-300 hover:-translate-y-1" title={name}>
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Quick Links</h4>
              <ul className="space-y-4">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-base text-slate-400 font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Top Services</h4>
              <ul className="space-y-4">
                {services.map((s) => (
                  <li key={s.name}>
                    <Link to={s.href} className="text-base text-slate-400 font-medium hover:text-emerald-400 transition-colors flex items-center gap-2 group">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-emerald-400 transition-colors"></span>
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 tracking-wide">Newsletter</h4>
              <p className="text-base text-slate-400 font-medium mb-6">Gain access to exclusive health tips and priority updates.</p>
              <div className="relative group">
                <input type="email" placeholder="Email address" className="w-full pl-5 pr-14 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-base font-medium text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all" />
                <button className="absolute right-2 top-2 bottom-2 aspect-square bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-500 transition-colors">
                  <Send className="w-5 h-5 -ml-0.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">
            © {new Date().getFullYear()} MediCare Premium Platform.
          </p>
          <div className="flex gap-6 text-sm font-medium text-slate-500">
            <Link to="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
