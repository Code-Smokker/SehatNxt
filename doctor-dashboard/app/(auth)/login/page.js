"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '@/services/authService';
import { setToken } from '@/lib/utils';

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [doctorData, setDoctorData] = useState(null);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (mobile.length !== 10) return;

        setLoading(true);

        // DEMO LOGIN BYPASS
        if (mobile === '9876543210') {
            console.log("Demo Login Initiated");
            // Simulate network delay for realism
            setTimeout(() => {
                setLoading(false);
                setStep(2);
            }, 500);
            return;
        }

        try {
            // Real Backend OTP Generation
            const data = await authService.sendOtp(mobile);

            // Log the returned OTP for testing (Developer Experience)
            if (data.otp) {
                console.log(`
================================
[AUTH] Sending OTP to ${mobile}
[AUTH] CODE: ${data.otp}
================================ 
               `);
            }

            setStep(2);
        } catch (error) {
            alert(error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        setLoading(true);

        // DEMO LOGIN BYPASS
        if (mobile === '9876543210') {
            console.log("Demo Verification Success");
            setTimeout(() => {
                setToken("demo_token_12345");
                localStorage.setItem('user_id', "demo_user");
                localStorage.setItem('doctor_id', "demo_doctor");
                router.push('/dashboard');
                setLoading(false);
            }, 500);
            return;
        }

        try {
            // Real Backend OTP Verification
            const data = await authService.verifyOtp(mobile, otp);
            setDoctorData(data);

            if (data.token) {
                setToken(data.token);
                if (data.userId) localStorage.setItem('user_id', data.userId);
                if (data.doctorId) localStorage.setItem('doctor_id', data.doctorId);
            }

            if (data.isProfileComplete && data.doctorId) {
                router.push('/dashboard');
            } else {
                // Determine step 2 (Profile Setup)
                router.push('/onboarding');
            }
        } catch (error) {
            alert(error.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
                <div className="flex justify-center mb-6">
                    {/* Assuming image is copied */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="SehatNxt" className="h-10" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Doctor Login</CardTitle>
                <p className="text-xs text-slate-500">Manage your practice with ease</p>
            </CardHeader>
            <CardContent>
                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Mobile Number</label>
                            <div className="flex gap-2">
                                <span className="flex items-center justify-center w-12 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 text-sm font-bold">
                                    +91
                                </span>
                                <input
                                    type="tel"
                                    placeholder="98765 43210"
                                    value={mobile}
                                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                    className="flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-bold tracking-wide text-slate-800 placeholder:text-slate-300"
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-sm font-bold" disabled={loading || mobile.length < 10}>
                            {loading ? <Loader2 className="animate-spin" /> :
                                <>Continue <ArrowRight size={16} className="ml-2" /></>}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Enter OTP</label>
                            <input
                                type="text"
                                placeholder="XXXXXX"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full text-center text-2xl tracking-[0.5em] rounded-lg border border-slate-200 px-3 py-3 font-bold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-200"
                                autoFocus
                            />
                            <div className="flex justify-between text-xs mt-2">
                                <span className="text-slate-400">Sent to +91 {mobile}</span>
                                <button type="button" onClick={() => setStep(1)} className="text-blue-600 font-medium hover:underline">
                                    Change Number
                                </button>
                            </div>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                            Verify & Login
                        </Button>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
