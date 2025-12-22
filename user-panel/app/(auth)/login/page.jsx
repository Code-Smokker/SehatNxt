"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import Splash from "@/components/shared/Splash";
import { sendOtp, verifyOtp } from "@/actions/auth";

export default function LoginPage() {
    const [showSplash, setShowSplash] = useState(true);
    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (mobile.length !== 10) return setError("Enter valid mobile number");

        setLoading(true);
        const fd = new FormData();
        fd.append("mobile", mobile);

        const res = await sendOtp(fd);
        setLoading(false);

        res.success ? setStep(2) : setError(res.error);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (otp.length !== 6) return setError("Invalid OTP");

        setLoading(true);
        const fd = new FormData();
        fd.append("mobile", mobile);
        fd.append("otp", otp);

        const res = await verifyOtp(null, fd);
        setLoading(false);

        if (res.success) {
            // Save user to local storage for Sidebar/Onboarding usage
            if (typeof window !== 'undefined' && res.user) {
                localStorage.setItem("sehat_user", JSON.stringify(res.user));
            }

            // Redirect based on server response (Home or Onboarding)
            router.push(res.redirectUrl || "/home");
            router.refresh();
        } else setError(res.error);
    };

    return (
        <>
            {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

            <main
                className="min-h-screen flex items-center justify-center relative overflow-hidden"
                role="main"
                aria-label="SehatNxt login page"
            >
                {/* 🌈 Premium Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EEF3FF] via-[#F8FBFF] to-[#EEF9F4]" />

                <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-400/20 blur-[180px] rounded-full animate-floatSlow" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-400/20 blur-[180px] rounded-full animate-floatSlow delay-[6s]" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="w-full max-w-sm p-6 relative z-10"
                >
                    {/* Header */}
                    <header className="text-center mb-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative h-16 w-auto mx-auto mb-6"
                        >
                            <Image
                                src="/logo.png"
                                alt="SehatNxt healthcare platform logo"
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                priority
                                className="object-contain"
                            />
                        </motion.div>
                        <div className="w-32 h-[1.5px] bg-gradient-to-r from-transparent via-slate-900 to-transparent my-6 opacity-80 mx-auto" />


                        {/* SEO-safe single H1 */}
                        <motion.h1
                            className="text-md font-bold leading-snug
              bg-gradient-to-r text-gray-600
              bg-clip-text text-transparent"
                        >
                            Begin Your Sehat Journey
                        </motion.h1>
                    </header>



                    {/* Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-[0_25px_60px_rgba(0,0,0,0.08)]"
                    >
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.form
                                    key="mobile"
                                    onSubmit={handleSendOtp}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 15 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        Mobile Number
                                    </label>

                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 group-focus-within:text-blue-600 transition-colors">
                                            +91
                                        </span>
                                        <input
                                            type="tel"
                                            value={mobile}
                                            onChange={(e) =>
                                                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
                                            }
                                            placeholder="00000 00000"
                                            className="w-full pl-14 pr-4 py-4 rounded-2xl
                      bg-slate-50 font-bold tracking-widest text-slate-800
                      focus:outline-none focus:ring-4 focus:ring-blue-500/20
                      transition-all"
                                        />
                                    </div>

                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        disabled={loading || mobile.length !== 10}
                                        className="w-full py-4 rounded-2xl
                    bg-gradient-to-r from-blue-600 to-indigo-600
                    text-white font-bold
                    shadow-[0_18px_40px_rgba(59,130,246,0.35)]"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin mx-auto" />
                                        ) : (
                                            "Get Verification Code"
                                        )}
                                    </motion.button>
                                </motion.form>
                            )}

                            {step === 2 && (
                                <motion.form
                                    key="otp"
                                    onSubmit={handleVerifyOtp}
                                    initial={{ opacity: 0, x: 15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -15 }}
                                    transition={{ duration: 0.4 }}
                                    className="space-y-6"
                                >
                                    <label className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                                        Enter OTP
                                    </label>

                                    <input
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                                        }
                                        placeholder="------"
                                        className="w-full py-4 text-center text-2xl
                    tracking-[0.5em] rounded-2xl bg-slate-50
                    font-bold focus:ring-4 focus:ring-green-500/20 text-slate-900"
                                    />

                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        className="w-full py-4 rounded-2xl
                    bg-gradient-to-r from-green-500 to-emerald-600
                    text-white font-bold
                    shadow-[0_18px_40px_rgba(16,185,129,0.35)]"
                                    >
                                        Verify & Login
                                    </motion.button>
                                </motion.form>
                            )}
                        </AnimatePresence>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-red-500 text-xs mt-4"
                            >
                                {error}
                            </motion.p>
                        )}
                    </motion.div>

                    <footer className="text-center mt-12 text-xs text-gray-800 font-medium">
                        Sehat simplified!
                    </footer>
                </motion.div>

                {/* Animations */}
                <style jsx global>{`
          @keyframes floatSlow {
            0%,100% { transform: translate(0,0); }
            50% { transform: translate(30px,-30px); }
          }
          .animate-floatSlow {
            animation: floatSlow 28s ease-in-out infinite;
          }
        `}</style>
            </main>
        </>
    );
}
