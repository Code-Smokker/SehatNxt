"use client";

import React from "react";

const BackgroundEffects = () => {
    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            {/* 🌈 Premium Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#EEF3FF] via-[#F8FBFF] to-[#EEF9F4]" />

            {/* Floating Orbs - Matching Login/Splash */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-400/10 blur-[150px] rounded-full animate-floatSlow" />
            <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-indigo-300/10 blur-[150px] rounded-full animate-floatSlow delay-[5s]" />
            <div className="absolute bottom-[-100px] left-[10%] w-[600px] h-[600px] bg-emerald-400/10 blur-[150px] rounded-full animate-floatSlow delay-[10s]" />

            {/* Global Animations Style */}
            <style jsx global>{`
                @keyframes floatSlow {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(30px, -30px); }
                }
                .animate-floatSlow {
                    animation: floatSlow 25s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default BackgroundEffects;
