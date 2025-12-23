"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ChevronLeft, Star, Clock, Building2, Calendar, CheckCircle2, Heart } from 'lucide-react';
import axios from 'axios';
import { bookAppointment } from '@/actions/appointment';
import { saveDoctor, removeDoctor, checkIsDoctorSaved } from '@/actions/savedDoctor';
import { doctors } from '@/assets_frontend/assets';


// Helper to get dates
const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        dates.push({
            day: nextDate.toLocaleDateString('en-US', { weekday: 'short' }),
            date: nextDate.getDate(),
            fullDate: nextDate.toDateString(), // for comparison
        });
    }
    return dates;
};

const TIME_SLOTS = {
    Morning: ["09:00 AM", "09:30 AM", "10:00 AM", "11:00 AM"],
    Afternoon: ["12:00 PM", "12:30 PM", "01:00 PM", "02:00 PM"],
    Evening: ["05:00 PM", "05:30 PM", "06:00 PM", "07:00 PM"]
};

// Params will be passed from the page component wrapper
const DoctorProfilePage = ({ id }) => {
    const router = useRouter();
    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [consultType, setConsultType] = useState(null); // 'clinic' | 'video'
    const [isBooking, setIsBooking] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    const dataFetched = React.useRef(false);

    // Load Doctor Data
    useEffect(() => {
        if (dataFetched.current) return;
        dataFetched.current = true;

        const performFetch = async () => {
            // 1. Check Static Data first (for "doc1", "doc2" etc.)
            const staticDoc = doctors.find(d => d._id === id);
            if (staticDoc) {
                setDoctor({
                    ...staticDoc,
                    id: staticDoc._id,
                    specialty: staticDoc.speciality,
                    exp: staticDoc.experience.replace(' Years', ''),
                    rating: "4.8",
                    phone: "1234567890",
                    // Ensure address format compatibility
                    address: typeof staticDoc.address === 'object'
                        ? `${staticDoc.address.line1}, ${staticDoc.address.line2}`
                        : staticDoc.address || 'Unknown Location',
                    lat: 12.9716,
                    lng: 77.5946
                });

                // Static docs can't be saved to backend easily without real ID, skipping check or mocking it
                setIsSaved(false);
                return;
            }

            // 2. Fetch from Backend if not static
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
                const res = await axios.get(`${baseUrl}/doctor/${id}`, { withCredentials: true });
                if (res.data.success) {
                    const foundDoctor = res.data.doctor;
                    setDoctor({
                        ...foundDoctor,
                        id: foundDoctor._id,
                        specialty: foundDoctor.speciality,
                        exp: foundDoctor.experience.replace(' Years', ''),
                        rating: "4.8",
                        phone: "1234567890",
                        address: foundDoctor.address ? `${foundDoctor.address.line1}, ${foundDoctor.address.line2}` : 'Unknown Location',
                        lat: 12.9716,
                        lng: 77.5946
                    });

                    const saved = await checkIsDoctorSaved(foundDoctor._id);
                    setIsSaved(saved);
                } else {
                    // Don't auto-redirect, let it show loading or empty
                    console.error("Doctor not found in API");
                }
            } catch (error) {
                console.error("Failed to fetch doctor:", error);
            }
        };

        if (id) performFetch();
    }, [id, router]);

    const handleSave = async () => {
        // Optimistic UI Update
        const previousState = isSaved;
        setIsSaved(!isSaved);

        try {
            if (previousState) {
                // Was saved, so remove
                const res = await removeDoctor(doctor.id);
                if (!res.success) throw new Error(res.message);
                // alert("Removed from My Doctors"); // Optional feedback
            } else {
                // Was not saved, so save
                const res = await saveDoctor(doctor.id);
                if (!res.success) throw new Error(res.message);
                // alert("Doctor saved successfully"); // Optional feedback
            }
        } catch (error) {
            console.error("Save/Remove Error:", error);
            setIsSaved(previousState); // Revert on failure
            alert("Failed to update saved list.");
        }
    };

    const handleConfirm = async () => {
        if (!selectedDate || !selectedSlot || !consultType) return;

        // Redirect to Payment Summary Page with details
        const queryString = new URLSearchParams({
            doctorId: doctor.id,
            doctorName: doctor.name,
            specialty: doctor.specialty,
            image: typeof doctor.image === 'string' ? doctor.image : '',
            date: selectedDate,
            time: selectedSlot,
            mode: consultType,
            fees: consultType === 'chat' ? 0 : doctor.fees,
            address: doctor.address,
        }).toString();

        router.push(`/payment-summary?${queryString}`);
    };

    const handleWhatsApp = () => {
        const message = encodeURIComponent(
            `Hello Dr. ${doctor?.name}, I want to chat regarding an appointment.`
        );
        const url = `https://wa.me/${doctor?.phone}?text=${message}`;
        window.open(url, "_blank");
    };

    if (!doctor) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;

    const dates = getDates();

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-28 ">

            {/* --- 1. Top Navbar --- */}
            <div className="sticky top-0 z-50 w-full
                bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400
                text-white rounded-b-3xl
                pb-6 pt-5 px-5
                shadow-xl shadow-blue-800/20"
            >
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => window.history.length > 1 ? router.back() : router.push('/')}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition active:scale-95"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold">Doctor Profile</h1>
                        <p className="text-xs text-blue-100 font-medium">Schedule your appointment</p>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition active:scale-95 group"
                    >
                        <Heart
                            size={20}
                            className={`transition-colors ${isSaved ? 'fill-red-500 text-red-500' : 'text-white group-hover:text-red-100'}`}
                        />
                    </button>
                </div>
            </div>

            {/* --- 2. Floating Doctor Profile Card --- */}
            <div className="px-4 -mt-6 sticky z-40 pt-10">
                <div className="bg-white rounded-3xl p-5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col gap-4">
                    <div className="flex gap-4">
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <Image
                                src={doctor?.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
                                alt={doctor.name}
                                fill
                                sizes="(max-width: 768px) 30vw, 15vw"
                                priority
                                className="rounded-2xl object-cover shadow-sm bg-slate-50"
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-slate-800 leading-tight">{doctor.name}</h2>
                            <p className="text-sm text-blue-600 font-semibold mt-1">{doctor.specialty}</p>

                            <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                                    <Star size={12} className="text-amber-500 fill-amber-500" />
                                    <span className="text-xs font-bold text-amber-700">{doctor.rating}</span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">(120 Reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-50">
                        <div className="text-center">
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Experience</p>
                            <p className="text-sm font-bold text-slate-700">{doctor.exp} Years</p>
                        </div>
                        <div className="text-center border-l border-slate-100">
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Patients</p>
                            <p className="text-sm font-bold text-slate-700">1.2k+</p>
                        </div>
                        <div className="text-center border-l border-slate-100">
                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Location</p>
                            <p className="text-sm font-bold text-slate-700 truncate max-w-full px-1">{doctor.address.split(',')[1] || 'City'}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-1">About Doctor</h3>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                            {doctor.about}
                        </p>
                    </div>

                    <div className="pt-2">
                        <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                            <Building2 size={14} className="text-blue-500" /> Clinic Location
                        </h3>
                        {/* Get Directions Button */}
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-slate-800 leading-snug">
                                        {doctor.address}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(doctor.address)}`;
                                    window.open(url, '_blank');
                                }}
                                className="w-full py-3 bg-white border border-slate-200 text-blue-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-navigation"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
                                Get Directions
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- CONTENT SCROLL --- */}
            <div className="px-4 mt-6 flex flex-col gap-8">

                {/* 3. Appointment Calendar */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar size={18} className="text-blue-500" /> Select Date
                    </h3>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 snap-x">
                        {dates.map((d, index) => {
                            const isSelected = selectedDate === d.fullDate;
                            return (
                                <div
                                    key={index}
                                    onClick={() => setSelectedDate(d.fullDate)}
                                    className={`
                                        snap-start min-w-[70px] h-20 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300
                                        ${isSelected
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                                            : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                                        }
                                    `}
                                >
                                    <span className={`text-xs font-medium ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>{d.day}</span>
                                    <span className="text-xl font-bold mt-1">{d.date}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 4. Time Slots */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-blue-500" /> Available Time
                    </h3>
                    <div className="flex flex-col gap-6">
                        {Object.entries(TIME_SLOTS).map(([period, slots]) => (
                            <div key={period}>
                                <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wide">{period}</h4>
                                <div className="grid grid-cols-4 gap-3">
                                    {slots.map((time) => {
                                        const isSelected = selectedSlot === time;
                                        return (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedSlot(time)}
                                                className={`
                                                    py-2 rounded-xl text-xs font-bold transition-all duration-300
                                                    ${isSelected
                                                        ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500 ring-offset-1'
                                                        : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50'
                                                    }
                                                `}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Consultation Options */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-4">Consultation Type</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Clinic Card */}
                        <div
                            onClick={() => setConsultType('clinic')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-[0_6px_20px_-5px_rgba(0,0,0,0.1)] hover:scale-[1.02] duration-200
                                ${consultType === 'clinic' ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'bg-white border-slate-100'}
                            `}
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-600">
                                <Building2 size={20} />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Clinic Visit</h4>
                            <p className="text-xs text-slate-500 mt-1">Wait time: ~15 min</p>
                            <p className="text-sm font-bold text-slate-800 mt-2">₹{doctor.fees}</p>
                            {consultType === 'clinic' && <CheckCircle2 className="absolute top-3 right-3 text-blue-500" size={18} />}
                        </div>

                        {/* WhatsApp Chat Card */}
                        <div
                            onClick={() => setConsultType('chat')}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden shadow-[0_6px_20px_-5px_rgba(0,0,0,0.1)] hover:scale-[1.02] duration-200
                                ${consultType === 'chat' ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : 'bg-white border-slate-100'}
                            `}
                        >
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3 text-green-600">
                                {/* Simple Chat Icon */}
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Chat with Clinic</h4>
                            <p className="text-xs text-slate-500 mt-1">Free on WhatsApp</p>
                            <p className="text-sm font-bold text-slate-800 mt-2">Free</p>
                            {consultType === 'chat' && <CheckCircle2 className="absolute top-3 right-3 text-green-500" size={18} />}
                        </div>
                    </div>
                </div>

            </div>

            {/* --- 6. Confirm Footer --- */}
            <div className="fixed bottom-0 w-full left-0 bg-white border-t border-slate-100 p-4 pb-8 z-50 rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
                <div className="flex items-center justify-between mb-0">
                    <div>
                        <p className="text-xs text-slate-400 font-medium">Total Payable</p>
                        <p className="text-xl font-bold text-slate-900">
                            {consultType === 'chat' ? 'Free' : `₹${doctor.fees}`}
                        </p>
                    </div>

                    {consultType === 'chat' ? (
                        <button
                            onClick={handleWhatsApp}
                            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-green-200 transition-all hover:shadow-xl active:scale-95 flex items-center gap-2"
                        >
                            Chat on WhatsApp
                        </button>
                    ) : (
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedDate || !selectedSlot || !consultType}
                            className={`
                                px-8 py-3.5 rounded-2xl text-sm font-bold text-white shadow-lg transition-all
                                ${(!selectedDate || !selectedSlot || !consultType)
                                    ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                    : 'bg-slate-900 hover:bg-slate-800 hover:shadow-xl active:scale-95'
                                }
                            `}
                        >
                            {isBooking ? 'Booking...' : 'Confirm Appointment'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorProfilePage;
