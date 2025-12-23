"use client";
import React from 'react';
import { Bell, MapPin } from 'lucide-react';

export default function MobileDoctorHeader() {
    return (
        <div className="bg-blue-600 block md:hidden pb-12 pt-6 px-6 rounded-b-[2.5rem] shadow-lg relative z-10">
            <div className="flex justify-between items-center text-white mb-4">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
                        <span className="font-bold text-lg">DR</span>
                    </div>
                    <div>
                        <p className="text-xs text-blue-100 uppercase tracking-wider font-medium">Welcome Back</p>
                        <h1 className="text-lg font-bold leading-none">Dr. Sharma</h1>
                    </div>
                </div>
                <button className="relative p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border border-white"></span>
                </button>
            </div>
        </div>
    );
}
