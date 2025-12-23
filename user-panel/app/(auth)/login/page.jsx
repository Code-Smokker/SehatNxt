"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Splash from "@/components/shared/Splash";

export default function LoginPage() {
    // State
    const [showSplash, setShowSplash] = useState(true);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Handlers
    const handleGoogleSuccess = async (credentialResponse) => {
        console.log("Google Login Success Callback Triggered:", credentialResponse);
        setLoading(true);
        setError("");

        try {
            const { credential } = credentialResponse;
            const res = await axios.post("/api/auth/google", { credential });

            if (res.data.success) {
                console.log("Login Success! Redirecting to /home...");
                if (typeof window !== 'undefined' && res.data.user) {
                    localStorage.setItem("sehat_user", JSON.stringify(res.data.user));
                    localStorage.setItem("token", "google-session");
                }

                // Force hard navigation to ensure cookies are sent
                window.location.href = "/home";
            }
        } catch (err) {
            console.error("Google Login Error", err);
            setError("Authentication failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <>
            {showSplash && <Splash onComplete={() => setShowSplash(false)} />}

            <main
                className="min-h-screen flex items-center justify-center relative overflow-hidden"
                role="main"
                aria-label="SehatNxt login page"
            >
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#EEF3FF] via-[#F8FBFF] to-[#EEF9F4]" />

                {/* Animated Orbs (CSS Animation) */}
                <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-blue-400/20 blur-[180px] rounded-full animate-floatSlow" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-400/20 blur-[180px] rounded-full animate-floatSlow delay-[6s]" />

                <div className="w-full max-w-sm p-6 relative z-10 animate-fadeIn">
                    {/* Header */}
                    <header className="text-center mb-8">
                        <div className="relative h-20 w-auto mx-auto mb-6 transform hover:scale-105 transition-transform duration-500">
                            <Image
                                src="/Sehatnxtlogo.png"
                                alt="SehatNxt Logo"
                                fill
                                sizes="(max-width: 768px) 100vw, 300px"
                                priority
                                className="object-contain"
                            />
                        </div>

                        <h1 className="text-xl font-bold text-slate-800">Welcome Back</h1>
                        <p className="text-sm text-slate-500 mt-2">Sign in to manage your health</p>
                    </header>

                    {/* Login Card */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-[0_25px_60px_rgba(0,0,0,0.08)] border border-white/50 animate-slideUp">
                        <div className="flex flex-col items-center gap-6">
                            {/* Google Button */}
                            <div className="w-full flex justify-center transform hover:scale-[1.02] transition-transform">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Google Login Failed")}
                                    useOneTap
                                    theme="filled_blue"
                                    shape="pill"
                                    size="large"
                                    width="280"
                                    text="continue_with"
                                />
                            </div>

                            {loading && (
                                <p className="text-xs font-medium text-blue-600 animate-pulse">
                                    Verifying secure session...
                                </p>
                            )}

                            {error && (
                                <p className="text-center text-red-500 text-xs font-semibold bg-red-50 py-2 px-4 rounded-lg">
                                    {error}
                                </p>
                            )}

                            <div className="pt-6 border-t border-slate-100 w-full text-center">
                                <p className="text-[10px] text-slate-400">
                                    By continuing, you agree to our <span className="text-slate-600 underline cursor-pointer">Terms</span> & <span className="text-slate-600 underline cursor-pointer">Privacy Policy</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <footer className="text-center mt-12 text-xs text-slate-400 font-medium tracking-wide">
                        Sehat Simplified
                    </footer>
                </div>
            </main>
        </>
    );
}
