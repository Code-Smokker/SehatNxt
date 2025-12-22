"use client";

import React, { useState, useEffect } from 'react';
import {
    Search, Mic, ChevronLeft, MapPin, Star, ArrowRight
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { specialityData } from '@/assets_frontend/assets';

// --- HELPER FUNCTIONS ---
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    var R = 6371;
    var dLat = (lat2 - lat1) * (Math.PI / 180);
    var dLon = (lon2 - lon1) * (Math.PI / 180);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
};

// Adapt specialityData to match category structure expected by UI (id, name, icon/image, bg, color)
// The new assets use 'image' prop instead of 'icon' component
const CATEGORIES = specialityData.map(s => ({
    id: s.searchKey || s.speciality, // Use searchKey for ID to match filtering
    name: s.speciality,
    image: s.image,
    bg: 'bg-blue-50', // Default
    color: 'text-blue-500'
})).concat([{ id: 'more', name: 'More', image: null, bg: 'bg-slate-50', color: 'text-slate-500' }]);

const BookAppointmentPage = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [userLoc, setUserLoc] = useState(null);
    const [doctors, setDoctors] = useState([]); // Raw API data
    const [filteredDoctors, setFilteredDoctors] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [categoryPage, setCategoryPage] = useState(0);

    // --- FILTERS STATE ---
    const [filters, setFilters] = useState({
        gender: null,
        exp: null,
        rating: null,
        availability: null
    });

    const dataFetched = React.useRef(false);

    // --- INITIAL LOAD ---
    useEffect(() => {
        if (dataFetched.current) return;
        dataFetched.current = true;

        if (typeof window !== 'undefined') {
            const savedLocation = localStorage.getItem("userLocation");
            if (savedLocation) {
                setUserLoc(JSON.parse(savedLocation));
            }
        }
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
            const res = await axios.get(`${baseUrl}/doctor/list`, { withCredentials: true });
            console.log("Doctors API Response:", res.data);
            if (res.data.success) {
                setDoctors(res.data.doctors);
            }
        } catch (error) {
            console.error("Failed to fetch doctors:", error);
        }
    };

    // --- FILTER LOGIC ---
    useEffect(() => {
        // Prepare doctors data with distance and mapping
        let result = doctors.map(doc => {
            // Mapping new asset format to component expectations
            // _id -> id, speciality -> specialty, experience -> exp (number)
            const expNum = parseInt(doc.experience) || 0;

            // Calculate distance if location available - assuming lat/lng mock if missing
            const lat = 12.9716;
            const lng = 77.5946;

            let dist = null;
            if (userLoc) {
                dist = getDistanceFromLatLonInKm(userLoc.lat, userLoc.lng, lat, lng);
            }

            return {
                ...doc,
                id: doc._id,
                specialty: doc.speciality,
                exp: expNum,
                rating: "4.8",
                fees: doc.fees,
                distance: dist
            };
        });

        // 1. Search Query
        if (searchQuery) {
            const lowerQ = searchQuery.toLowerCase();
            result = result.filter(doc =>
                doc.name.toLowerCase().includes(lowerQ) ||
                doc.specialty.toLowerCase().includes(lowerQ)
            );
        }

        // 2. Category Filter
        if (activeCategory && activeCategory !== 'more') {
            result = result.filter(doc => (doc.specialty || doc.speciality || '').toLowerCase() === activeCategory.toLowerCase());
        }

        // 3. Advanced Filters
        if (filters.gender) {
            // result = result.filter(doc => doc.gender === filters.gender); // New assets don't have gender yet
        }
        if (filters.exp === '5+') result = result.filter(doc => doc.exp >= 5);

        // Distance Sort
        if (userLoc) {
            result.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        }

        setFilteredDoctors(result);

    }, [searchQuery, userLoc, activeCategory, filters, doctors]);

    const toggleFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: prev[key] === value ? null : value
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">

            {/* --- TOP STICKY HEADER --- */}
            <div className="sticky top-0 backdrop-blur-md pb-2 pt-4 px-4 shadow-sm transition-all w-full 
                bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400
                text-white rounded-b-3xl 
                pb-6 pt-5 px-5 
                shadow-xl shadow-blue-800/20 
                relative z-50">
                {/* Nav & Search */}
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => router.back()} className="p-2 bg-white rounded-full shadow-sm border border-slate-100 active:scale-95 transition">
                        <ChevronLeft size={20} className="text-slate-700" />
                    </button>
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search doctors, clinics..."
                            className="w-full pl-10 pr-10 py-3 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500/20 text-sm font-medium outline-none text-slate-700 placeholder:text-slate-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Mic size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500" />
                    </div>
                </div>

                {/* Horizontal Filters Scroll */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 snap-x">
                    <FilterChip label="Male" active={filters.gender === 'Male'} onClick={() => toggleFilter('gender', 'Male')} />
                    <FilterChip label="Female" active={filters.gender === 'Female'} onClick={() => toggleFilter('gender', 'Female')} />
                    <FilterChip label="5+ Yrs Exp" active={filters.exp === '5+'} onClick={() => toggleFilter('exp', '5+')} />
                    <FilterChip label="4.5+ Rating" active={filters.rating === '4.5+'} onClick={() => toggleFilter('rating', '4.5+')} />
                    <FilterChip label="Today" active={filters.availability === 'Today'} onClick={() => toggleFilter('availability', 'Today')} />
                </div>
            </div>

            {/* --- CONTENT --- */}
            <div className="px-4 mt-4">
                {/* Categories Grid with Slide Pagination */}
                <div className="mb-6 overflow-hidden">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Specialties</h3>

                    <div
                        className="flex transition-transform duration-500 ease-in-out"
                        style={{ transform: `translateX(-${categoryPage * 100}%)` }}
                    >
                        {/* PAGE 0: First 7 + More */}
                        <div className="w-full flex-shrink-0 grid grid-cols-4 gap-3 px-1">
                            {CATEGORIES.filter(c => c.id !== 'more').slice(0, 7).map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all active:scale-95 cursor-pointer
                                        ${activeCategory === cat.id ? 'bg-blue-100 ring-2 ring-blue-500 ring-offset-2' : 'bg-white hover:bg-slate-100'}
                                    `}
                                >
                                    <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center shadow-sm overflow-hidden relative`}>
                                        <Image src={cat.image} alt={cat.name} fill sizes="48px" className="object-cover p-2" />
                                    </div>
                                    <span className="text-[10px] text-center font-medium text-slate-600 leading-tight">{cat.name}</span>
                                </div>
                            ))}
                            {/* More Button */}
                            <div
                                onClick={() => setCategoryPage(1)}
                                className="flex flex-col items-center gap-2 p-2 rounded-xl transition-all active:scale-95 cursor-pointer bg-white hover:bg-slate-100"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100">
                                    <ArrowRight size={20} className="text-slate-500" />
                                </div>
                                <span className="text-[10px] text-center font-medium text-slate-600 leading-tight">More</span>
                            </div>
                        </div>

                        {/* PAGE 1: Back + Remaining */}
                        <div className="w-full flex-shrink-0 grid grid-cols-4 gap-3 px-1">
                            {/* Back Button */}
                            <div
                                onClick={() => setCategoryPage(0)}
                                className="flex flex-col items-center gap-2 p-2 rounded-xl transition-all active:scale-95 cursor-pointer bg-white hover:bg-slate-100"
                            >
                                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center shadow-sm border border-slate-100">
                                    <ChevronLeft size={20} className="text-slate-500" />
                                </div>
                                <span className="text-[10px] text-center font-medium text-slate-600 leading-tight">Back</span>
                            </div>

                            {CATEGORIES.filter(c => c.id !== 'more').slice(7).map(cat => (
                                <div
                                    key={cat.id}
                                    onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                                    className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all active:scale-95 cursor-pointer
                                        ${activeCategory === cat.id ? 'bg-blue-100 ring-2 ring-blue-500 ring-offset-2' : 'bg-white hover:bg-slate-100'}
                                    `}
                                >
                                    <div className={`w-12 h-12 rounded-full ${cat.bg} flex items-center justify-center shadow-sm overflow-hidden relative`}>
                                        <Image src={cat.image} alt={cat.name} fill sizes="48px" className="object-cover p-2" />
                                    </div>
                                    <span className="text-[10px] text-center font-medium text-slate-600 leading-tight">{cat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Doctors List */}
                <div>
                    <div className="flex justify-between items-end mb-4 px-1">
                        <h3 className="text-lg font-bold text-slate-800">Doctors Near You</h3>
                        <span className="text-xs font-semibold text-slate-400">{filteredDoctors.length} found</span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {filteredDoctors.length > 0 ? filteredDoctors.map(doctor => (
                            <DoctorCard key={doctor.id} doctor={doctor} router={router} />
                        )) : (
                            <div className="text-center py-10 opacity-60">
                                <p className="text-slate-500 font-medium">No doctors found matching your criteria.</p>
                                <button
                                    onClick={() => { setFilters({}); setSearchQuery(''); setActiveCategory(null); }}
                                    className="text-blue-600 text-sm font-bold mt-2"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

// --- SUB COMPONENTS ---

const FilterChip = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm border snap-start
            ${active ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}
        `}
    >
        {label}
    </button>
);

const DoctorCard = ({ doctor, router }) => {
    return (
        <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex gap-4 transition-transform active:scale-[0.98]">
            {/* Image */}
            <div className="relative flex-shrink-0 w-20 h-20">
                <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    sizes="(max-width: 768px) 30vw, 15vw"
                    className="rounded-xl object-cover shadow-sm bg-slate-100"
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-slate-800 text-base leading-tight truncate">{doctor.name}</h4>
                        <p className="text-xs text-blue-600 font-semibold mt-0.5">{doctor.specialty}</p>
                        {/* Rating Badge */}
                        <div className="flex items-center gap-1 mt-1.5">
                            <div className="flex items-center gap-0.5 bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                <Star size={10} className="text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-bold text-slate-700">{doctor.rating}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">({Math.floor(Math.random() * 50) + 10} reviews)</span>
                        </div>
                    </div>
                    {/* Distance Badge */}
                    {doctor.distance && (
                        <div className="flex items-center gap-1 bg-slate-100 px-1.5 py-1 rounded-md">
                            <MapPin size={10} className="text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500">{doctor.distance} km</span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3 mt-3">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Experience</span>
                        <span className="text-xs font-bold text-slate-700">{doctor.exp} Years</span>
                    </div>
                    <div className="w-[1px] h-6 bg-slate-100"></div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium uppercase">Fees</span>
                        <span className="text-xs font-bold text-slate-700">₹{doctor.fees}</span>
                    </div>
                </div>

                <button
                    onClick={() => router.push(`/book-appointment/${doctor.id}`)}
                    className="w-full mt-3 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-slate-200 hover:shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    Book Appointment <ArrowRight size={14} />
                </button>
            </div>
        </div>
    );
};

export default BookAppointmentPage;
