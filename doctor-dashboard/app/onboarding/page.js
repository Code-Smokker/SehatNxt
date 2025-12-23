"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2, User, Stethoscope, GraduationCap, Clock, Info, MapPin, IndianRupee, Phone, Upload } from 'lucide-react';
import axios from 'axios';
import { getToken } from '@/lib/utils'; // Make sure this exists or use localStorage

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '', // Can be pre-filled
        speciality: '',
        degree: '',
        experience: '',
        about: '',
        fees: '',
        addressLine1: '',
        addressLine2: '',
        image: '/assets_frontend/profile_pic.png' // Default or upload logic
    });

    useEffect(() => {
        // Optional: Fetch user details to pre-fill name/phone if available
        // For now, let them enter it or trust the backend to link via token
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = getToken();
            if (!token) throw new Error("No session found. Please login again.");

            const payload = {
                ...formData,
                address: {
                    line1: formData.addressLine1,
                    line2: formData.addressLine2
                }
            };

            const res = await axios.post('http://localhost:5000/api/doctor/update-profile', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                // Save doctor_id
                localStorage.setItem('doctor_id', res.data.doctor._id);
                router.push('/dashboard');
            }
        } catch (error) {
            console.error(error);
            alert("Failed to save profile: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-slate-100 p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold text-slate-800">Complete Your Profile</h1>
                    <p className="text-slate-500">Tell us about your practice to start accepting patients</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="name" required placeholder="Dr. John Doe" value={formData.name} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase">Speciality</label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <select name="speciality" required value={formData.speciality} onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
                                    <option value="">Select Speciality</option>
                                    <option value="General physician">General Physician</option>
                                    <option value="Gynecologist">Gynecologist</option>
                                    <option value="Dermatologist">Dermatologist</option>
                                    <option value="Pediatricians">Pediatricians</option>
                                    <option value="Neurologist">Neurologist</option>
                                    <option value="Gastroenterologist">Gastroenterologist</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase">Degree</label>
                            <div className="relative">
                                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="degree" required placeholder="MBBS, MD" value={formData.degree} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase">Experience</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="experience" required placeholder="5 Years" value={formData.experience} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase">Consultation Fees</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="fees" type="number" required placeholder="500" value={formData.fees} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">About</label>
                        <div className="relative">
                            <Info className="absolute left-3 top-3 text-slate-400" size={16} />
                            <textarea name="about" required placeholder="Brief description about your practice..." value={formData.about} onChange={handleChange} rows={3}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase">Clinic Address</label>
                        <div className="grid gap-3">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="addressLine1" required placeholder="Address Line 1" value={formData.addressLine1} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input name="addressLine2" required placeholder="City, State" value={formData.addressLine2} onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                            </div>
                        </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-base font-bold h-12 rounded-xl" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" /> : "Save & Continue to Dashboard"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
