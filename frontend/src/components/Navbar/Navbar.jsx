import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Show, SignInButton, UserButton } from "@clerk/react";
import { cn } from "../../utils";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { name: "Home", to: "/" },
    { name: "Doctors", to: "/doctors" },
    { name: "Services", to: "/services" },
    { name: "Appointments", to: "/appointments" },
    { name: "Contact", to: "/contact" },
  ];

  const isActive = (to) => location.pathname === to;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] transition-all duration-700",
        scrolled
          ? "bg-white/80 backdrop-blur-2xl border-b border-slate-900/[0.04]"
          : "bg-transparent"
      )}
      style={scrolled ? { boxShadow: '0 1px 2px rgba(0,0,0,0.03)' } : {}}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 opacity-100 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Activity size={18} strokeWidth={2.5} className="text-white drop-shadow-sm" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-heading font-extrabold tracking-tight text-slate-900 leading-none">
                MediCare
              </span>
              <span className="text-[9px] font-semibold text-slate-400 tracking-[0.15em] uppercase leading-none mt-0.5">
                Healthcare
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-50/80 rounded-2xl p-1.5 border border-slate-100/80">
            {links.map((l) => (
              <Link
                key={l.name}
                to={l.to}
                className={cn(
                  "relative px-4 py-2 rounded-xl text-[13px] font-medium transition-all duration-300",
                  isActive(l.to)
                    ? "text-slate-900 bg-white shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                )}
              >
                {l.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="hidden md:inline-flex cursor-pointer items-center justify-center h-10 px-6 rounded-xl text-sm font-semibold transition-all duration-300 active:scale-[0.97] bg-slate-900 text-white hover:bg-slate-800" style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)' }}>
                  Get Started
                </button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <div className="hidden md:flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl bg-slate-50 border border-slate-100">
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 ring-2 ring-white"
                    }
                  }}
                />
              </div>
            </Show>

            {/* Mobile toggle */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={menuOpen ? 'close' : 'menu'}
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.15 }}
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-2xl border-t border-slate-100"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  key={l.name}
                >
                  <Link
                    to={l.to}
                    className={cn(
                      "block px-4 py-3 rounded-xl text-sm font-medium transition-all",
                      isActive(l.to)
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    {l.name}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-3 pt-3 border-t border-slate-100">
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="w-full py-3 rounded-xl cursor-pointer bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors">
                      Get Started
                    </button>
                  </SignInButton>
                </Show>
                <Show when="signed-in">
                  <div className="flex items-center justify-center py-2">
                    <UserButton showName={true}
                      appearance={{
                        elements: {
                          userButtonBox: "flex flex-row-reverse w-full justify-between items-center px-4 py-2",
                          userButtonOuterIdentifier: "text-slate-900 font-medium text-sm ml-0 mr-auto flex-1",
                          userButtonAvatarBox: "w-9 h-9"
                        }
                      }}
                    />
                  </div>
                </Show>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}