"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock } from 'lucide-react';
import Image from "next/image";
import { doctors } from '@/assets_frontend/assets';
import { useRouter } from 'next/navigation';
// Removed axios import

const NearestDoctors = () => {
    const router = useRouter();
    // No Loading state needed for static assets
    const sortedDoctors = doctors.map(doc => ({
        ...doc,
        // Ensure image fallback if needed (though assets should have them)
        // Add mock distance/rating if not in asset file
        rating: "4.9",
        distance: ((doc.name.length % 5) + 1.2).toFixed(1) // Deterministic distance to fix hydration error
    }));

    return (
        <section className="mt-8 mb-8">
            <div className="flex justify-between items-center px-5 mb-3">
                <h2 className="text-lg font-bold text-slate-800">Top Doctors to Book</h2>
            </div>

            <div className="flex overflow-x-auto gap-3.5 px-4 pb-4 no-scrollbar snap-x snap-mandatory">
                {sortedDoctors.slice(0, 10).map((doctor) => (
                    <div
                        key={doctor._id}
                        onClick={() => router.push(`/doctor/${doctor._id}`)}
                        className="min-w-[180px] max-w-[180px] bg-white rounded-2xl shadow-[0_2px_12px_rgb(0,0,0,0.06)] border border-slate-100 snap-center overflow-hidden flex flex-col cursor-pointer hover:border-blue-200 transition-all"
                    >
                        {/* DOCTOR IMAGE - COMPACT */}
                        <div className="h-32 w-full relative bg-gradient-to-b from-slate-50 to-slate-100 flex items-end justify-center pt-2">
                            <Image
                                src={doctor.image}
                                alt={doctor.name}
                                fill
                                className="object-cover object-top"
                                sizes="180px"
                            />
                            {/* Rating badge overlaid on image */}
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex items-center gap-0.5 shadow-sm">
                                <Star size={10} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-[10px] font-bold text-slate-700">{doctor.rating}</span>
                            </div>
                        </div>

                        {/* DOCTOR DETAILS */}
                        <div className="p-3 flex-1 flex flex-col">
                            <h3 className="font-bold text-slate-900 text-sm leading-tight mb-0.5 line-clamp-1">
                                {doctor.name}
                            </h3>

                            <p className="text-[10px] text-slate-500 font-semibold mb-2 line-clamp-1">
                                {doctor.speciality}
                            </p>

                            <div className="flex items-center gap-2 mb-3 text-[10px] text-slate-400">
                                <div className="flex items-center gap-0.5">
                                    <MapPin size={10} />
                                    <span>{doctor.distance} km</span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <Clock size={10} />
                                    <span>{doctor.experience}</span>
                                </div>
                            </div>

                            {/* FOOTER ACTION */}
                            <button className="mt-auto w-full bg-blue-50 hover:bg-blue-100 active:scale-95 text-blue-600 text-[10px] font-bold py-2 rounded-xl transition-all duration-200">
                                Book Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NearestDoctors;
