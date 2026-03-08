import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Clock, Users, CalendarCheck, TrendingUp, Sparkles, Heart, Zap } from 'lucide-react';
import bannerImg from '../../assets/BannerImg.png';

const ease = [0.16, 1, 0.3, 1];

function FloatingCard({ children, className, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay, ease }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export default function Hero() {
    return (
        <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 overflow-hidden">
            {/* Ambient orbs */}
            <div className="absolute top-[-200px] right-[-100px] w-[700px] h-[700px] bg-emerald-100/40 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[-150px] left-[-120px] w-[600px] h-[600px] bg-teal-100/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-12 lg:pb-16">
                <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center min-h-[80vh]">

                    {/* ─── Left: Content ─── */}
                    <div className="flex flex-col items-start max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease }}
                            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100/80 mb-7"
                        >
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700 tracking-wide">Trusted by 50,000+ patients</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.08, ease }}
                            className="text-[2.5rem] sm:text-5xl lg:text-[3.5rem] font-heading font-extrabold text-slate-900 tracking-tight leading-[1.12] mb-5"
                        >
                            Your health deserves{' '}
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">exceptional</span>
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.6, ease }}
                                    className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full origin-left"
                                />
                            </span>{' '}
                            care.
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.15, ease }}
                            className="text-base sm:text-lg text-slate-500 mb-8 leading-relaxed"
                        >
                            Connect with world-class specialists, book instant appointments, and experience healthcare designed around you — all from one seamless platform.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.22, ease }}
                            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-10"
                        >
                            <Link
                                to="/doctors"
                                className="group gradient-border flex items-center justify-center gap-2.5 px-7 py-3.5 bg-slate-900 text-white rounded-2xl font-semibold text-sm transition-all duration-300 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/10 active:scale-[0.97]"
                            >
                                Book Appointment
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                            <Link
                                to="/services"
                                className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-slate-700 rounded-2xl font-semibold text-sm border border-slate-200 transition-all duration-300 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm active:scale-[0.97]"
                            >
                                Explore Services
                            </Link>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4, ease }}
                            className="flex items-center gap-5"
                        >
                            <div className="flex -space-x-2">
                                {['HD1.png', 'HD2.png', 'HD3.png', 'HD4.png'].map((img, i) => (
                                    <img
                                        key={i}
                                        src={new URL(`../../assets/${img}`, import.meta.url).href}
                                        alt=""
                                        className="w-8 h-8 rounded-full border-[2px] border-white object-cover"
                                    />
                                ))}
                                <div className="w-8 h-8 rounded-full border-[2px] border-white bg-emerald-50 flex items-center justify-center text-[10px] font-bold text-emerald-700">
                                    +99
                                </div>
                            </div>
                            <div className="h-8 w-px bg-slate-200" />
                            <div className="flex flex-col">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                                    ))}
                                    <span className="text-xs font-bold text-slate-800 ml-1.5">4.9</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">12,000+ reviews</span>
                            </div>
                        </motion.div>
                    </div>

                    {/* ─── Right: Clean Image + Cards Outside ─── */}
                    <div className="relative flex items-center justify-center lg:justify-end">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.94, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.15, ease }}
                            className="relative w-full max-w-[520px]"
                        >
                            {/* Glow behind image */}
                            <div className="absolute inset-6 bg-gradient-to-br from-emerald-200/30 to-teal-200/20 rounded-[2.5rem] blur-3xl" />

                            {/* Clean Image — NO cards overlapping faces */}
                            <div className="relative rounded-[2rem] overflow-hidden border border-white/70 group" style={{ boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.12)' }}>
                                <img
                                    src={bannerImg}
                                    alt="Premium Healthcare"
                                    className="w-full h-[480px] sm:h-[560px] object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-[1.03]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-white/5" />

                                {/* Only a small, non-intrusive badge at the very bottom */}
                                <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                                    <div className="flex items-center justify-between bg-white/80 backdrop-blur-xl rounded-2xl px-4 py-3 border border-white/60" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
                                        <div className="flex items-center gap-2.5">
                                            <div className="relative">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                                                    <Zap className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-none">Available Now</p>
                                                <p className="text-[10px] text-slate-500 font-medium">24/7 instant booking</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                            <span className="text-sm font-extrabold text-slate-900">4.96</span>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </motion.div>
                    </div>
                </div>

                {/* ─── Trust Metrics Bar ─── */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease }}
                    className="mt-10 pt-8 border-t border-slate-100"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { icon: Shield, value: "100%", label: "Verified Doctors", iconColor: "text-emerald-600", bgColor: "bg-emerald-50" },
                            { icon: Clock, value: "<15min", label: "Avg Wait Time", iconColor: "text-blue-600", bgColor: "bg-blue-50" },
                            { icon: Star, value: "4.9/5", label: "Patient Rating", iconColor: "text-amber-500", bgColor: "bg-amber-50" },
                            { icon: TrendingUp, value: "98%", label: "Recovery Rate", iconColor: "text-violet-600", bgColor: "bg-violet-50" },
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.7 + i * 0.08, ease }}
                                className="flex items-center gap-3 group"
                            >
                                <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                    <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                                </div>
                                <div>
                                    <p className="text-lg font-extrabold text-slate-900 leading-none">{stat.value}</p>
                                    <p className="text-[11px] text-slate-400 font-medium mt-1">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
