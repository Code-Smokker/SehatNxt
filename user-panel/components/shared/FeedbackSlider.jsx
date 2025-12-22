"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Star } from 'lucide-react';
import Image from "next/image";

// --- MOCK DATA ---
const feedbacks = [
    {
        id: 1,
        name: "Sneha Kapoor",
        role: "Early User",
        rating: 5,
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        comment:
            "Very easy to use. Booking appointments feels smooth and fast. The UI is clean and intuitive, especially on mobile devices."
    },
    {
        id: 2,
        name: "Dr. Amit Sharma",
        role: "Consulting Doctor",
        rating: 4,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        comment:
            "The appointment flow and patient visibility look promising. With real data integration, this can be very impactful for clinics."
    }
];

// --- COMPONENT: Review Text with Expand Logic ---
const ReviewText = ({ text }) => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="mt-3">
            <p
                className={`text-slate-600 text-sm leading-relaxed transition-all duration-300 ${expanded ? "" : "line-clamp-2"}`}
            >
                "{text}"
            </p>
            {text.length > 50 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent card click if any
                        setExpanded(!expanded);
                    }}
                    className="text-blue-600 text-xs font-bold mt-1.5 hover:underline"
                >
                    {expanded ? "Read less" : "Read more"}
                </button>
            )}
        </div>
    );
};

const FeedbackSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef(null);
    const touchStartRef = useRef(0);
    const touchEndRef = useRef(0);

    // Auto-slide Logic
    const resetTimeout = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex(prev => prev === feedbacks.length - 1 ? 0 : prev + 1);
        }, 6000); // 6 seconds

        return () => resetTimeout();
    }, [currentIndex]);

    // Manual Slide Control
    const nextSlide = () => {
        setCurrentIndex(prev => prev === feedbacks.length - 1 ? 0 : prev + 1);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => prev === 0 ? feedbacks.length - 1 : prev - 1);
    };

    // Swipe Handling for Mobile
    const handleTouchStart = (e) => {
        touchStartRef.current = e.targetTouches[0].clientX;
        resetTimeout(); // Pause auto-slide on interaction
    };

    const handleTouchMove = (e) => {
        touchEndRef.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (!touchStartRef.current || !touchEndRef.current) return;
        const distance = touchStartRef.current - touchEndRef.current;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();

        // Reset refs
        touchStartRef.current = 0;
        touchEndRef.current = 0;
    };

    return (
        <section className="mt-8 px-1 pb-6 w-full max-w-lg mx-auto md:max-w-none">
            {/* Context Header */}
            <div className="mb-4 pl-1">
                <h2 className="text-lg font-bold text-slate-800">Patient Feedback</h2>
                <p className="text-xs text-slate-500 mt-0.5">Stories from our community</p>
            </div>

            {/* Slider Container */}
            <div className="relative w-full overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Slides Wrapper */}
                <div
                    className="transition-transform duration-500 ease-out flex"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {feedbacks.length > 0 ? (
                        feedbacks.map((review) => (
                            <div key={review.id} className="w-full flex-shrink-0 px-1">
                                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] min-h-[160px] flex flex-col justify-center">

                                    {/* Profile Header */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="relative w-10 h-10 flex-shrink-0">
                                            <Image
                                                src={review.avatar}
                                                alt={review.name}
                                                fill
                                                className="rounded-full object-cover border border-slate-100"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm leading-tight">{review.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">{review.role}</p>
                                        </div>
                                        <div className="ml-auto flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={`${i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Dynamic Text */}
                                    <ReviewText text={review.comment} />

                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-8 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                            <p className="text-sm text-slate-400">Feedback from our early users and doctors will appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-1.5 mt-4">
                {feedbacks.map((_, idx) => (
                    <div
                        key={idx}
                        className={`transition-all duration-300 rounded-full h-1.5 ${currentIndex === idx ? "w-4 bg-blue-500" : "w-1.5 bg-slate-200"}`}
                    ></div>
                ))}
            </div>

        </section>
    );
};

export default FeedbackSlider;
