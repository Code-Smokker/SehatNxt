"use client";

import React, { useEffect, useState } from "react";
// eslint-disable-next-line @next/next/no-img-element
// using img tag for local asset to avoid configuration issues with next/image in this environment

const Splash = ({ onComplete }) => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // 1. Start fade out slightly before the 1s mark for smoothness
        const timer1 = setTimeout(() => {
            setFadeOut(true);
        }, 800);

        // 2. Trigger completion (unmount/redirect) exactly at 1s or slightly after fade
        const timer2 = setTimeout(() => {
            if (onComplete) onComplete();
        }, 1100);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [onComplete]);

    return (
        <div
            className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden
            bg-gradient-to-br from-indigo-50 via-white to-blue-50
            transition-opacity duration-500 ease-out
            ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}
        `}
        >
            {/* --- Background Ambient Glow --- */}
            <div className="absolute w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -top-32 -left-20 animate-pulse"></div>
            <div className="absolute w-[400px] h-[400px] bg-indigo-300/10 rounded-full blur-[100px] bottom-0 right-0"></div>

            {/* --- Logo Container (Scale Animation) --- */}
            <div className="relative w-40 h-16 animate-[enterScale_0.8s_ease-out_forwards] flex items-center justify-center">
                <img
                    src="/logo.png"
                    alt="SehatNxt"
                    className="object-contain w-full h-full"
                />
            </div>

            {/* --- Tagline (Slide Up) --- */}
            <p className="mt-6 text-slate-500 font-medium tracking-wide text-sm animate-[slideUp_0.8s_ease-out_0.2s_both]">
                Sehat, ab aur bhi simple
            </p>

            <style jsx global>{`
                @keyframes enterScale {
                    0% { transform: scale(0.9); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                @keyframes slideUp {
                    0% { transform: translateY(10px); opacity: 0; }
                    100% { transform: translateY(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default Splash;
