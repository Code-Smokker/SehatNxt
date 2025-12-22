"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Construction, Clock } from "lucide-react";

const ComingSoonPage = ({ title = "Coming Soon", description = "We are working hard to bring this feature to you." }) => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Header */}
            <div className="bg-white sticky top-0 z-50 px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition text-slate-600"
                >
                    <ChevronLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-slate-800">{title}</h1>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6 animate-pulse">
                    <Construction size={48} />
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2">Coming Soon!</h2>
                <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-8">
                    {description}
                </p>

                <div className="flex items-center gap-2 px-4 py-2 bg-slate-200 rounded-full text-xs font-bold text-slate-600">
                    <Clock size={14} />
                    <span>Launch ETA: Q1 2025</span>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
