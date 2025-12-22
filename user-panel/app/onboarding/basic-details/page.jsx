"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Loader2, CheckCircle, ShieldCheck } from "lucide-react";
import { completeOnboarding } from "@/actions/auth";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [userLoc, setUserLoc] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: ""
    });
    const [touched, setTouched] = useState({ name: false, email: false });
    const [isValid, setIsValid] = useState(false);

    // Initial Load
    useEffect(() => {
        // Retrieve mobile from localStorage (set during login)
        const storedUser = localStorage.getItem("sehat_user");
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setFormData(prev => ({
                    ...prev,
                    mobile: parsed.phone || "",
                    // Pre-fill if they exist (rare case of re-entry)
                    name: parsed.name !== "New User" ? parsed.name : "",
                    email: !parsed.email?.endsWith("@sehatnxt.com") ? parsed.email : ""
                }));
            } catch (e) {
                console.error("Error parsing user data", e);
            }
        } else {
            // Safety: If no user data, redirect to login
            router.push("/login");
        }
    }, [router]);

    // Validation Logic
    useEffect(() => {
        const isNameValid = formData.name.trim().length >= 2;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = emailRegex.test(formData.email);

        setIsValid(isNameValid && isEmailValid);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid || loading) return;

        setLoading(true);

        const fd = new FormData();
        fd.append("mobile", formData.mobile);
        fd.append("name", formData.name.trim());
        fd.append("email", formData.email.trim());

        const res = await completeOnboarding(fd);

        if (res.success) {
            // Update Local Storage
            localStorage.setItem("sehat_user", JSON.stringify(res.user));

            // Dispatch event for other components (like Sidebar)
            window.dispatchEvent(new Event("storage"));

            // Redirect
            router.push("/home");
            router.refresh();
        } else {
            alert(res.error || "Something went wrong");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
            >
                {/* Header Section */}
                <div className="bg-blue-50/50 p-8 text-center border-b border-slate-100">
                    <div className="relative w-24 h-12 mx-auto mb-4">
                        <Image
                            src="/logo.png"
                            alt="SehatNxt"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Welcome to SehatNxt 👋</h1>
                    <p className="text-slate-500 text-sm">Let’s complete your profile to personalize your care</p>
                </div>

                {/* Form Section */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Mobile (Read Only) */}
                        <div className="space-y-1.5 opacity-70">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                Mobile Number <ShieldCheck size={12} className="text-green-500" />
                            </label>
                            <input
                                type="text"
                                value={formData.mobile}
                                readOnly
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-500 font-semibold cursor-not-allowed text-sm"
                            />
                        </div>

                        {/* Full Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                onBlur={() => handleBlur('name')}
                                placeholder="e.g. Rahul Sharma"
                                className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 transition-all text-sm
                                    ${touched.name && formData.name.length < 2
                                        ? 'border-red-300 focus:ring-red-100'
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                            />
                            {touched.name && formData.name.length < 2 && (
                                <p className="text-[10px] text-red-500 font-medium pl-1">
                                    Name must be at least 2 characters
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={() => handleBlur('email')}
                                placeholder="rahul@example.com"
                                className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 transition-all text-sm
                                    ${touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                                        ? 'border-red-300 focus:ring-red-100'
                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-100'
                                    }`}
                            />
                            {touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                                <p className="text-[10px] text-red-500 font-medium pl-1">
                                    Please enter a valid email address
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!isValid || loading}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                                ${isValid && !loading
                                    ? 'bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-[0.98]'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                "Complete Profile"
                            )}
                        </button>

                    </form>
                </div>
            </motion.div>
        </main>
    );
}
