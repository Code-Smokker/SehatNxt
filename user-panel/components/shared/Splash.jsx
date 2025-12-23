"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

const Splash = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1300);

    const completeTimer = setTimeout(() => {
      onComplete?.();
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      role="status"
      aria-label="Loading SehatNxt application"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden
      transition-opacity duration-700 ease-out
      ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}
      `}
    >
      {/* 🌈 SAME BACKGROUND AS LOGIN */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#EEF3FF] via-[#F8FBFF] to-[#EEF9F4]" />

      {/* Floating Orbs */}
      <div
        aria-hidden
        className="absolute -top-40 -left-40 w-[700px] h-[700px]
        bg-blue-400/20 blur-[180px] rounded-full animate-floatSlow"
      />
      <div
        aria-hidden
        className="absolute bottom-[-120px] right-[-120px] w-[600px] h-[600px]
        bg-emerald-400/20 blur-[180px] rounded-full animate-floatSlow delay-[6s]"
      />

      {/* Logo */}
      <div className="relative w-44 h-20 animate-logoEnter">
        <Image
          src="/Sehatnxtlogo.png"
          alt="SehatNxt – Digital Healthcare Platform"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          priority
          className="object-contain"
        />
      </div>

      {/* Divider */}
      <div className="w-32 h-[1.5px] bg-gradient-to-r from-transparent via-slate-900 to-transparent my-6 opacity-80 mx-auto" />


      {/* Tagline */}
      <p className="text-slate-500 text-xs tracking-widest animate-slideUp">
        Sehat, simplified.
      </p>

      {/* Animations */}
      <style jsx global>{`
        @keyframes logoEnter {
          0% {
            transform: scale(0.92) translateY(10px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideUp {
          0% {
            transform: translateY(10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes floatSlow {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, -30px);
          }
        }

        .animate-logoEnter {
          animation: logoEnter 0.9s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.7s ease-out 0.6s both;
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out 0.4s both;
        }

        .animate-floatSlow {
          animation: floatSlow 28s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Splash;
