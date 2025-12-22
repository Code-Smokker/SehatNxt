"use client";

import React, { useState, useEffect } from "react";
import { ChevronRight, Wind, Share2, Info, ArrowRight, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useLocation } from "@/context/LocationContext";

const OfferSlider = () => {
    const router = useRouter();
    const { selectedLocation, openLocationModal } = useLocation();

    const [slides, setSlides] = useState([
        { id: 'aqi-placeholder', type: 'aqi', status: 'loading' }
    ]);

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Active Marketing Slides
                let activeSlides = [];
                try {
                    // Using internal Next.js API route (no port 8000)
                    const slidesRes = await axios.get('/api/marketing/slider?active=true');

                    if (slidesRes.data && slidesRes.data.success && Array.isArray(slidesRes.data.data)) {
                        activeSlides = slidesRes.data.data.map(slide => ({ ...slide, type: 'marketing' }));
                    } else if (Array.isArray(slidesRes.data)) {
                        activeSlides = slidesRes.data.map(slide => ({ ...slide, type: 'marketing' }));
                    }
                } catch (e) {
                    console.error("Failed to fetch marketing slides", e);
                }

                // 2. Fetch AQI
                let aqiSlide = {
                    id: 'aqi-live',
                    type: 'aqi',
                    title: "Air Quality",
                    subtitle: selectedLocation?.name || "Fetching location...", // Use friendly name
                    status: "loading",
                    value: "--",
                    category: "Loading...",
                    updatedAt: null
                };

                if (selectedLocation?.lat && selectedLocation?.lng) {
                    try {
                        const aqiRes = await axios.post('/api/aqi', {
                            lat: selectedLocation.lat,
                            lng: selectedLocation.lng
                        });

                        if (aqiRes.data && aqiRes.data.success) {
                            const { aqi, category, healthAdvice, updatedAt } = aqiRes.data.data;
                            aqiSlide = {
                                ...aqiSlide,
                                title: selectedLocation.name || selectedLocation.fullAddress || "Current Location",
                                subtitle: category || "Unknown",
                                description: healthAdvice,
                                value: aqi,
                                status: "active", // Internal status for render
                                category: category, // Display text
                                loading: false,
                                updatedAt: updatedAt
                            };
                        }
                    } catch (aqiErr) {
                        // console.error("AQI Fetch Error", aqiErr);
                        aqiSlide = {
                            ...aqiSlide,
                            subtitle: "Unavailable",
                            status: "error",
                            description: "Could not fetch live AQI data."
                        };
                    }
                } else {
                    aqiSlide = {
                        ...aqiSlide,
                        subtitle: "Enable Location",
                        status: "no-location"
                    };
                }

                // MERGE: Ensure unique keys
                setSlides([aqiSlide, ...activeSlides]);

            } catch (error) {
                console.error("Slider Init Error", error);
            }
        };

        fetchData();

        // Auto-refresh AQI every 10 mins (600000ms)
        const refreshTimer = setInterval(fetchData, 600000);
        return () => clearInterval(refreshTimer);

    }, [selectedLocation]);

    // ... (Auto Scroll logic remains same)

    const currentSlide = slides[currentIndex];

    // Helpers
    const getAQIColor = (aqi) => {
        if (!aqi || aqi === '--') return { bg: 'bg-slate-100', text: 'text-slate-500', name: 'Unknown' };
        if (aqi <= 50) return { bg: 'bg-emerald-500', text: 'text-emerald-700', name: 'Good' };
        if (aqi <= 100) return { bg: 'bg-yellow-400', text: 'text-yellow-700', name: 'Moderate' };
        if (aqi <= 150) return { bg: 'bg-orange-500', text: 'text-orange-700', name: 'Unhealthy' };
        return { bg: 'bg-red-500', text: 'text-red-700', name: 'Hazardous' };
    };

    // Helper for gradient background based on Category
    const getGradient = (category) => {
        const c = (category || '').toLowerCase();
        if (c.includes('good')) return 'from-emerald-50 to-teal-50 border-emerald-100';
        if (c.includes('moderate')) return 'from-yellow-50 to-orange-50 border-yellow-100';
        if (c.includes('unhealthy')) return 'from-orange-50 to-red-50 border-orange-100';
        if (c.includes('hazardous') || c.includes('poor')) return 'from-red-50 to-pink-50 border-red-100';
        return 'from-slate-50 to-gray-50 border-slate-100';
    };

    const renderContent = (slide) => {
        if (slide.type === 'aqi') {

            // 1. NO LOCATION STATE
            if (slide.status === 'no-location') {
                return (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-slate-50 text-center px-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 text-blue-600 animate-pulse">
                            <MapPin size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">Check Air Quality</h2>
                        <p className="text-sm text-slate-500 mb-4 max-w-xs">Enable location access to see real-time AQI in your area.</p>
                        <button onClick={openLocationModal} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition active:scale-95">
                            Enable Location
                        </button>
                    </div>
                );
            }

            // 2. LOADING STATE
            if (slide.status === 'loading') {
                return (
                    <div className="flex items-center justify-between w-full h-full px-6 bg-white">
                        <div className="space-y-3 w-1/2">
                            <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
                            <div className="h-8 w-40 bg-slate-100 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
                        </div>
                        <div className="w-24 h-24 bg-slate-100 rounded-full animate-pulse" />
                    </div>
                );
            }

            // 3. ERROR STATE
            if (slide.status === 'error') {
                return (
                    <div className="flex flex-col items-center justify-center w-full h-full bg-red-50 text-center px-6">
                        <Info size={32} className="text-red-400 mb-2" />
                        <p className="text-red-600 font-bold">AQI Unavailable</p>
                        <p className="text-xs text-red-400">Could not fetch data currently.</p>
                    </div>
                );
            }

            // 4. ACTIVE DATA STATE
            const gradient = getGradient(slide.category);
            const colorProps = getAQIColor(slide.value); // Determine color based on value logic or category

            // Calculate "Updated X mins ago"
            let updatedText = "";
            if (slide.updatedAt) {
                const diff = Math.floor((new Date() - new Date(slide.updatedAt)) / 60000);
                updatedText = diff < 1 ? "Just now" : `Updated ${diff}m ago`;
            }

            return (
                <div className={`flex items-center justify-between w-full h-full px-6 bg-gradient-to-r ${gradient}`}>
                    <div className="flex-1 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">LIVE AQI</span>
                            <span className="text-[10px] text-slate-400">• {updatedText}</span>
                        </div>

                        <h2 className="text-xl font-bold text-slate-800 leading-tight mb-0.5 line-clamp-1">
                            {slide.title}
                        </h2>
                        <p className={`text-sm font-bold ${colorProps.text} mb-2`}>
                            {slide.category}
                        </p>

                        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-2 text-xs text-slate-600 font-medium leading-relaxed max-w-sm line-clamp-2 border border-white/50">
                            {slide.description}
                        </div>
                    </div>

                    <div className="relative flex-shrink-0">
                        {/* Circle Indicator */}
                        <div className={`w-24 h-24 rounded-full border-4 border-white shadow-xl flex flex-col items-center justify-center ${colorProps.bg} text-white`}>
                            <span className="text-3xl font-black">{slide.value}</span>
                            <span className="text-[9px] font-bold opacity-80 uppercase">AQI</span>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-white text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded shadow-sm border border-slate-100">
                            Google
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="relative w-full h-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 flex flex-col justify-center px-8 text-white">
                    <h2 className="text-2xl font-bold mb-2 shadow-sm leading-tight max-w-md">{slide.title}</h2>
                    <p className="text-white/90 text-sm mb-5 max-w-sm line-clamp-2">{slide.description}</p>
                    {slide.ctaLink && (
                        <button
                            onClick={() => router.push(slide.ctaLink)}
                            className="w-fit px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-100 flex items-center gap-2 transition-all active:scale-95"
                        >
                            {slide.ctaText || "Explore"} <ArrowRight size={16} />
                        </button>
                    )}
                </div>
                <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
            </div>
        );
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
            <div className="relative w-full h-[220px] md:h-[260px] rounded-3xl overflow-hidden shadow-sm border border-slate-100 bg-white">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full"
                    >
                        {renderContent(currentSlide)}
                    </motion.div>
                </AnimatePresence>
                {slides.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-1.5 rounded-full transition-all ${idx === currentIndex ? "bg-white w-6 opacity-100" : "bg-white w-1.5 opacity-50"}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfferSlider;
