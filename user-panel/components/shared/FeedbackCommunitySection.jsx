"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import Image from "next/image";

const reviews = [
    {
        id: 1,
        name: "Rahul Verma",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        text: "The best app for booking appointments! Found a great dentist near me within minutes. Highly recommended."
    },
    {
        id: 2,
        name: "Sneha Kapoor",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        text: "Very easy to use. The medicine delivery was super fast and the consultation was smooth. Loved the UI and overall experience."
    },
    {
        id: 3,
        name: "Amit Singh",
        image: "https://randomuser.me/api/portraits/men/86.jpg",
        rating: 4,
        text: "Great experience finding a cardiologist. The location feature is very accurate and helpful. Looking forward to more features when the app launches."
    }
];

// ⭐ Read More Component
const ReviewText = ({ text }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mt-2">
            <p
                className={`text-slate-600 text-sm leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-2"
                    }`}
            >
                "{text}"
            </p>

            {text.length > 60 && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-blue-600 text-xs font-semibold mt-1"
                >
                    {expanded ? "Show less" : "Read more"}
                </button>
            )}
        </div>
    );
};

const FeedbackCommunitySection = () => {
    // --- Slider Logic ---
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);

    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex(prev =>
                prev === reviews.length - 1 ? 0 : prev + 1
            );
        }, 4000);

        return () => resetTimeout();
    }, [currentIndex]);

    return (
        <section className="mt-8 px-4 mb-20">

            {/* --- FEEDBACK SECTION --- */}
            <h2 className="text-lg font-bold text-slate-800 mb-4">Patient Feedback</h2>

            <div className="relative w-full overflow-hidden">
                <div
                    className="whitespace-nowrap transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(${-currentIndex * 100}%)` }}
                >
                    {reviews.map((review) => (
                        <div key={review.id} className="inline-block w-full whitespace-normal">
                            <div className="flex gap-3 p-4 shadow-sm border border-slate-200 rounded-2xl bg-white min-h-[150px]">

                                {/* Profile Pic */}
                                <div className="relative w-14 h-14 flex-shrink-0">
                                    <Image
                                        src={review.image}
                                        alt={review.name}
                                        fill
                                        sizes="56px"
                                        className="rounded-full object-cover border"
                                    />
                                </div>

                                {/* Review Content */}
                                <div className="flex-1">

                                    {/* Name + Stars */}
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h3 className="font-semibold text-slate-800 text-sm">{review.name}</h3>
                                            <p className="text-xs text-slate-400 -mt-0.5">Reviewer</p>
                                        </div>

                                        <div className="flex gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={`${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Review Text (2 lines + Read more) */}
                                    <ReviewText text={review.text} />

                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>

        </section>
    );
};

export default FeedbackCommunitySection;
