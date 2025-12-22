"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Calendar, Clock, MapPin, IndianRupee, Home, FileText } from 'lucide-react';
import Image from 'next/image';
import { assets } from '@/assets_frontend/assets';

const SuccessData = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const doctorName = searchParams.get('doctorName') || 'Doctor';
    const date = searchParams.get('date');
    const time = searchParams.get('time');
    const fees = searchParams.get('fees');
    const mode = searchParams.get('mode') || 'clinic';

    // Parse date for better display if needed, currently using string from URL
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    }) : 'Scheduled Date';

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 space-y-6 animate-in fade-in zoom-in duration-500">

            {/* Success Animation */}
            <div className="relative mb-2">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                        <Check size={40} className="text-white stroke-[3]" />
                    </div>
                </div>
            </div>

            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-slate-800">Booking Confirmed!</h1>
                <p className="text-slate-500 text-sm">Your appointment has been successfully booked.</p>
            </div>

            {/* Ticket Card */}
            <div className="w-full bg-white rounded-2xl shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden relative">
                {/* Decorative Top Border */}
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-cyan-400"></div>

                <div className="p-6 space-y-6">
                    {/* Doctor Info */}
                    <div className="flex items-center gap-4 pb-6 border-b border-dashed border-slate-200">
                        <div className="w-14 h-14 rounded-full bg-slate-100 overflow-hidden relative border border-slate-100">
                            <Image
                                src={assets.profile_pic || "/placeholder.png"}
                                alt="Doctor"
                                fill
                                className="object-cover"
                            />
                            {/* Note: In real app, we'd pass doctor image param or fetch it. showing generic or asset here */}
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Doctor</p>
                            <h3 className="text-lg font-bold text-slate-800">{doctorName}</h3>
                            <p className="text-xs font-semibold text-blue-600 bg-blue-50 inline-block px-2 py-0.5 rounded-full mt-1 uppercase">{mode === 'video' ? 'Video Call' : 'Clinic Visit'}</p>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                <Calendar size={12} /> Date
                            </div>
                            <p className="font-bold text-slate-700 text-sm">{formattedDate}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                <Clock size={12} /> Time
                            </div>
                            <p className="font-bold text-slate-700 text-sm">{time}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                <IndianRupee size={12} /> Fees
                            </div>
                            <p className="font-bold text-slate-700 text-sm">₹{fees}</p>
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase">
                                <MapPin size={12} /> Location
                            </div>
                            <p className="font-bold text-slate-700 text-sm">Main Clinic, London</p>
                        </div>
                    </div>
                </div>

                {/* Ticket Cutout Effect */}
                <div className="absolute top-[88px] -left-3 w-6 h-6 bg-slate-50 rounded-full"></div>
                <div className="absolute top-[88px] -right-3 w-6 h-6 bg-slate-50 rounded-full"></div>
            </div>

            {/* Actions */}
            <div className="flex flex-col w-full gap-3 pt-4">
                <button
                    onClick={() => router.push('/appointments')}
                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <FileText size={18} /> View My Appointments
                </button>
                <button
                    onClick={() => router.push('/home')}
                    className="w-full bg-white text-slate-600 font-bold py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Home size={18} /> Back to Home
                </button>
            </div>

        </div>
    );
}

const SuccessPage = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center font-sans">
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessData />
            </Suspense>
        </div>
    );
};

export default SuccessPage;
