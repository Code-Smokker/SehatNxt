"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Hero = () => {
    const router = useRouter();

    // Assets as strings (paths in /public)
    const DoctorHero = "/doctor.png";
    const Labtest = "/labtest.png";
    const Medicine = "/Medicine.png";

    return (
        <div className="mt-2 px-1">

            {/* --- BIG TOP CARD --- */}
            <div
                onClick={() => router.push('/book-appointment')}
                className="bg-gradient-to-r from-purple-200 to-white rounded-3xl shadow-sm border border-slate-100 p-6 mb-4 flex items-center justify-between relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
            >
                <div className="flex flex-col gap-3">
                    <p className="font-bold text-2xl text-slate-800 leading-tight">
                        Book<br />Appointment
                    </p>

                    <span className="inline-flex items-center gap-2 w-fit text-xs font-bold text-green-700 bg-white border border-green-200 px-3 py-1 rounded-full shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
                        </span>
                        LIVE TRACKING
                    </span>
                </div>

                <div className="relative w-32 h-32 flex-shrink-0 -mr-4">
                    {/* Use Image component */}
                    <Image
                        src={DoctorHero}
                        alt="doctor"
                        fill
                        sizes="128px"
                        className="object-cover rounded-2xl shadow-sm transform rotate-3 hover:rotate-0 transition-transform duration-300"
                    />
                </div>
            </div>

            {/* --- TWO SMALL CARDS BELOW --- */}
            <div className=" grid grid-cols-2 gap-4">

                {/* Medicines Delivery */}
                <div
                    // MIGRATION NOTE: We can't pass complex state object via query params in Next.js simply like React Router state.
                    // Instead we just navigate, and the page handles title/subtitle. Or use query params.
                    // For now, simpler navigation to coming-soon.
                    onClick={() => router.push('/coming-soon')}
                    className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center h-48 group relative overflow-hidden cursor-pointer"
                >
                    <div className="relative w-32 h-32 mb-2 group-hover:scale-110 transition-transform duration-300 z-10">
                        <Image
                            src={Medicine}
                            alt="lab test"
                            fill
                            sizes="112px"
                            className="object-contain"
                        />
                    </div>
                    <div className="text-center z-10">
                        <p className="font-bold text-lg text-slate-800 leading-tight">Medicines</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Fast Delivery</p>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute top-0 left-0 w-full h-full bg-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Lab Tests */}
                <div
                    onClick={() => router.push('/coming-soon')}
                    className="bg-gradient-to-br from-purple-50 to-white rounded-3xl shadow-sm border border-slate-100 p-4 flex flex-col items-center justify-center h-48 group relative overflow-hidden cursor-pointer"
                >
                    <div className="relative w-28 h-28 mb-2 group-hover:scale-110 transition-transform duration-300 z-10">
                        <Image
                            src={Labtest}
                            alt="lab test"
                            fill
                            sizes="112px"
                            className="object-contain"
                        />
                    </div>
                    <div className="text-center z-10">
                        <p className="font-bold text-lg text-slate-800 leading-tight">Lab Tests</p>
                        <p className="text-xs text-slate-500 font-medium mt-1">Home Sample</p>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute top-0 left-0 w-full h-full bg-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>

            </div>

        </div>
    );
};

export default Hero;
