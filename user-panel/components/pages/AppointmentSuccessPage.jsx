"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
    CheckCircle2,
    Home,
    Calendar,
    Clock,
    IndianRupee,
    Download,
    Share2
} from "lucide-react";
import { motion } from "framer-motion";

const AppointmentSuccessPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const doctorName = searchParams.get("doctorName");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const fees = searchParams.get("fees");
    const mode = searchParams.get("mode");

    if (!doctorName) return null;

    const formattedDate = date
        ? new Date(date).toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
        })
        : "--";

    const isFree = fees === "0" || fees === 0;

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center px-6 py-10 font-sans">

            {/* Background Orbs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] h-[300px] bg-green-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-sm flex flex-col items-center">

                {/* 1. Animated Success Icon */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
                    className="mb-6 relative"
                >
                    <div className="w-24 h-24 rounded-full bg-green-500 shadow-xl shadow-green-200 flex items-center justify-center z-10 relative">
                        <CheckCircle2 size={48} className="text-white drop-shadow-md" strokeWidth={3} />
                    </div>
                    {/* Pulsing ring */}
                    <div className="absolute top-0 left-0 w-full h-full rounded-full bg-green-400 animate-ping opacity-20"></div>
                </motion.div>

                {/* 2. Text Heading */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Booking Confirmed!</h1>
                    <p className="text-sm text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">
                        Appointment with <span className="font-bold text-slate-700">{doctorName}</span> is successful.
                    </p>
                </motion.div>

                {/* 3. Ticket Card */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 150, damping: 20, delay: 0.5 }}
                    className="w-full bg-white rounded-3xl p-0 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative"
                >
                    {/* Top Decorative Line */}
                    <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-blue-400"></div>

                    <div className="p-6">
                        {/* Doctor Info */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl shadow-sm">
                                {doctorName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Doctor</p>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight">{doctorName}</h3>
                                <span className="text-xs text-blue-500 font-semibold">{mode === "chat" ? "Video Consultation" : "In-Clinic Visit"}</span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                                    <Calendar size={10} /> Date
                                </p>
                                <p className="text-sm font-bold text-slate-700">{formattedDate}</p>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1 flex items-center gap-1">
                                    <Clock size={10} /> Time
                                </p>
                                <p className="text-sm font-bold text-slate-700">{time}</p>
                            </div>
                        </div>

                        {/* Dashed Separator */}
                        <div className="relative h-px w-full bg-slate-100 my-4">
                            <div className="absolute -left-8 -top-3 w-6 h-6 rounded-full bg-slate-50"></div>
                            <div className="absolute -right-8 -top-3 w-6 h-6 rounded-full bg-slate-50"></div>
                        </div>

                        {/* Amount Row */}
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Paid Amount</p>
                            {isFree ? (
                                <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                                    <CheckCircle2 size={12} className="text-green-600" />
                                    <span className="text-xs font-bold text-green-700 uppercase">Free</span>
                                </div>
                            ) : (
                                <span className="text-lg font-bold text-slate-800 flex items-center">
                                    <IndianRupee size={16} /> {fees}
                                </span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* 4. Action Buttons */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="w-full mt-8 flex flex-col gap-3"
                >
                    <button
                        onClick={() => router.push("/appointments")}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        View Appointments
                    </button>

                    <button
                        onClick={() => router.push("/home")}
                        className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <Home size={16} /> Return Home
                    </button>

                    <p className="text-[10px] text-center text-slate-400 mt-4 px-4 leading-relaxed">
                        A confirmation email has been sent to your registered email address.
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default AppointmentSuccessPage;
