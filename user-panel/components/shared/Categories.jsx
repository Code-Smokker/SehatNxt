"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { specialityData } from "@/assets_frontend/assets";

const ITEMS_PER_PAGE = 8;

const MostSearchedSpecialties = () => {
    const router = useRouter();
    const [page, setPage] = useState(0);

    const totalPages = Math.ceil(specialityData.length / ITEMS_PER_PAGE);

    return (
        <section className="mt-10 px-3">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
                Most searched specialties
            </h2>

            {/* Slider */}
            <div className="overflow-hidden">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${page * 100}%)` }}
                >
                    {Array.from({ length: totalPages }).map((_, pageIndex) => (
                        <div
                            key={pageIndex}
                            className="w-full flex-shrink-0 grid grid-cols-4 gap-y-6 gap-x-2"
                        >
                            {specialityData
                                .slice(
                                    pageIndex * ITEMS_PER_PAGE,
                                    pageIndex * ITEMS_PER_PAGE + ITEMS_PER_PAGE
                                )
                                .map((item, index) => (
                                    <button
                                        key={index}
                                        onClick={() => router.push(`/book-appointment?category=${encodeURIComponent(item.searchKey || item.speciality)}`)}
                                        className="flex flex-col items-center gap-2 active:scale-95 transition"
                                    >
                                        {/* Icon */}
                                        <div className="relative w-16 h-16 rounded-full bg-slate-100 hover:bg-blue-50 transition-colors flex items-center justify-center">
                                            <Image
                                                src={item.image}
                                                alt={item.speciality}
                                                fill
                                                className="object-contain p-3"
                                                sizes="64px"
                                            />
                                        </div>

                                        {/* Label */}
                                        <p className="text-[12px] text-center font-medium text-slate-700 leading-tight px-1">
                                            {item.speciality}
                                        </p>
                                    </button>
                                ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`h-2 rounded-full transition-all ${page === i ? "w-6 bg-blue-500" : "w-2 bg-slate-300"
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default MostSearchedSpecialties;
