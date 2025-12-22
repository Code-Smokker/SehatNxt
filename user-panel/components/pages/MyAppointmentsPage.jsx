"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar, Clock, MapPin, Video, Loader2,
    MoreVertical, Phone, Navigation, RefreshCw,
    AlertCircle, CheckCircle2, Star
} from 'lucide-react';
import { getMyAppointments } from '@/actions/appointment';
import ReviewModal from '@/components/reviews/ReviewModal';

const MyAppointmentsPage = () => {
    const router = useRouter();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewAppointment, setReviewAppointment] = useState(null);

    const fetchAppointments = async () => {
        try {
            const data = await getMyAppointments();
            setAppointments(data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-32">
            {reviewAppointment && (
                <ReviewModal
                    appointment={reviewAppointment}
                    onClose={() => setReviewAppointment(null)}
                    onSuccess={() => fetchAppointments()}
                />
            )}

            {/* Content Container */}
            <div className="p-4 flex flex-col gap-5 pt-6">

                {/* Empty State */}
                {!loading && appointments.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                            <Calendar size={40} className="text-blue-500 opacity-80" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">No appointments yet</h2>
                        <p className="text-slate-500 mt-2 max-w-xs text-sm">
                            Book your first consultation with a top doctor today.
                        </p>
                        <button
                            onClick={() => router.push('/home')}
                            className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            Book Appointment
                        </button>
                    </div>
                )}

                {/* Appointment Cards */}
                {appointments.map((apt) => (
                    <AppointmentCard
                        key={apt._id}
                        apt={apt}
                        onReview={() => setReviewAppointment(apt)}
                        router={router}
                    />
                ))}
            </div>
        </div>
    );
};

// --- Sub-Components ---

const AppointmentCard = ({ apt, onReview, router }) => {
    // Determine Doctor Details (Populated or Flat)
    const doc = (apt.doctorId && typeof apt.doctorId === 'object') ? apt.doctorId : {};

    // Fallbacks
    const doctorName = doc.name || apt.doctorName || "Unknown Doctor";
    const doctorImage = doc.image || ""; // Should have a fallback generic image
    const specialty = doc.speciality || apt.specialty || "General Physician";
    const experience = doc.experience ? `${doc.experience} Exp` : "Experience N/A";
    const address = doc.address ? `${doc.address.line1}, ${doc.address.line2}` : "Clinic details unavailable";
    const clinicName = doc.clinicName || "SehatNxt Clinic"; // Fallback

    // Status Logic
    const statusConfig = getStatusConfig(apt.status);
    const isOnline = apt.mode === 'online' || apt.type === 'video';
    const isCompleted = apt.status === 'completed';
    const isConfirmed = apt.status === 'confirmed';
    const isCancelled = apt.status === 'cancelled';

    return (
        <div className={`bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.08)] transition-all ${isCancelled ? 'opacity-70 grayscale-[0.5]' : ''}`}>

            {/* 1. Header: Doctor & Status */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden border border-slate-50">
                            {doctorImage ? (
                                <img src={doctorImage} alt={doctorName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                    <span className="text-xl font-bold">{doctorName.charAt(0)}</span>
                                </div>
                            )}
                        </div>
                        {/* Online Badge */}
                        {isOnline && (
                            <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full">
                                <span className="bg-blue-500 w-3 h-3 block rounded-full border-2 border-white"></span>
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-1">{doctorName}</h3>
                        <p className="text-slate-500 text-xs font-medium mt-1">{specialty} • {experience}</p>
                        {!isOnline && (
                            <p className="text-slate-400 text-[10px] mt-0.5 flex items-center gap-1">
                                <MapPin size={10} /> {clinicName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${statusConfig.className}`}>
                    {statusConfig.label}
                </span>
            </div>

            {/* 2. Schedule & Mode */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 mb-4 border border-slate-100">
                <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
                    <Calendar size={16} className="text-slate-500" />
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Date</p>
                        <p className="text-xs font-bold text-slate-700">{new Date(apt.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 pl-1">
                    <Clock size={16} className="text-slate-500" />
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Time</p>
                        <p className="text-xs font-bold text-slate-700">{apt.time}</p>
                    </div>
                </div>
                <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-white rounded-md border border-slate-100 shadow-sm">
                    {isOnline ? <Video size={12} className="text-blue-500" /> : <Building2Icon size={12} className="text-blue-500" />}
                    <span className="text-[10px] font-bold text-slate-600">{isOnline ? 'Video' : 'Clinic'}</span>
                </div>
            </div>

            {/* 3. Actions Footer (Contextual) */}
            <div className="flex gap-3 pt-2">

                {/* Re-Book (Always visible unless pending/confirmed future) */}
                {(isCompleted || isCancelled) && (
                    <button
                        onClick={() => router.push(`/book-appointment/${doc._id || apt.doctorId}`)}
                        className="flex-1 bg-blue-50 text-blue-700 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <RefreshCw size={14} /> Re-Book
                    </button>
                )}

                {/* Review (Only Completed) */}
                {isCompleted && (
                    <button
                        onClick={onReview}
                        className="flex-1 bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Star size={14} className="fill-current" /> Rate Doctor
                    </button>
                )}

                {/* Join Call (Confirmed + Online) */}
                {isConfirmed && isOnline && (
                    <button
                        className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-md shadow-green-200"
                    >
                        <Video size={14} /> Join Now
                    </button>
                )}

                {/* Directions (Confirmed + Clinic) */}
                {isConfirmed && !isOnline && (
                    <button
                        className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Navigation size={14} /> Get Directions
                    </button>
                )}

                {/* Pending State Action */}
                {statusConfig.key === 'pending' && (
                    <div className="w-full text-center py-1">
                        <p className="text-xs text-amber-600 font-medium flex items-center justify-center gap-1.5">
                            <Clock size={12} /> Awaiting doctor confirmation
                        </p>
                    </div>
                )}
            </div>

            {/* Cancelled Helper Text */}
            {isCancelled && (
                <p className="text-center text-[10px] text-slate-400 mt-3 font-medium">
                    This appointment was cancelled.
                </p>
            )}

        </div>
    );
};

// Utils
const Building2Icon = (props) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
        <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
        <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
        <path d="M10 6h4" />
        <path d="M10 10h4" />
        <path d="M10 14h4" />
        <path d="M10 18h4" />
    </svg>
);

const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
        case 'confirmed':
            return { label: 'Confirmed', className: 'bg-green-100 text-green-700', key: 'confirmed' };
        case 'pending':
            return { label: 'Pending', className: 'bg-amber-100 text-amber-700', key: 'pending' };
        case 'completed':
            return { label: 'Completed', className: 'bg-blue-100 text-blue-700', key: 'completed' };
        case 'cancelled':
            return { label: 'Cancelled', className: 'bg-red-50 text-red-500', key: 'cancelled' };
        case 'in_progress':
            return { label: 'In Progress', className: 'bg-purple-100 text-purple-700 animate-pulse', key: 'in_progress' };
        default:
            return { label: status, className: 'bg-slate-100 text-slate-600', key: 'default' };
    }
};

export default MyAppointmentsPage;
