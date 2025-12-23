"use client";
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Calendar, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AppointmentList from '@/components/dashboard/AppointmentList';
import FeedbackList from '@/components/dashboard/FeedbackList';
import ComprehensiveAppointmentTable from '@/components/dashboard/ComprehensiveAppointmentTable';
import AddPatientModal from '@/components/dashboard/AddPatientModal';
import axios from 'axios';

export default function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPatientModal, setShowPatientModal] = useState(false);
    const router = useRouter();

    const fetchStats = async () => {
        const doctorId = localStorage.getItem('doctor_id');
        if (!doctorId) {
            setLoading(false);
            return;
        }
        try {
            const res = await axios.get(`http://localhost:8000/api/dashboard/stats/${doctorId}`);
            setStats(res.data);
        } catch (err) {
            console.error("Stats fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    // Visual Cards Data (Top 3 Boxes)
    const visualStats = [
        {
            title: "Today's Appointments",
            value: loading ? "..." : (stats?.todayAppointments > 0 ? stats.todayAppointments : "0"), // Shortened for mobile
            sub: stats?.todayAppointments > 0 ? "Total Bookings" : "Check back later",
            image: "/assets_frontend/appointment.png",
            bg: "bg-blue-50"
        },
        {
            title: "New Patients",
            value: loading ? "..." : (stats?.newPatients > 0 ? stats.newPatients : "0"), // Shortened for mobile
            sub: stats?.newPatients > 0 ? "Registrations" : "Today",
            image: "/assets_frontend/General Physician.png",
            bg: "bg-purple-50"
        },
        {
            title: "Avg. Consultation Time",
            value: loading ? "..." : (stats?.avgConsultationTime ? `${stats.avgConsultationTime} min` : "N/A"), // Shortened
            sub: "Time per patient",
            image: "/assets_frontend/labtestside.png",
            bg: "bg-orange-50"
        }
    ];

    return (
        <div className="space-y-8 pb-24 md:pb-8 relative">
            {showPatientModal && (
                <AddPatientModal
                    onClose={() => setShowPatientModal(false)}
                    onSuccess={() => {
                        fetchStats(); // Refresh stats on success
                    }}
                />
            )}

            {/* Mobile Search Bar (Overlapping) */}
            <div className="md:hidden -mt-10 px-6 relative z-20">
                <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-3.5 flex items-center gap-3 border border-slate-100">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search patients, appointments..."
                        className="flex-1 bg-transparent outline-none text-slate-700 text-sm placeholder:text-slate-400 font-medium"
                    />
                </div>
            </div>

            {/* 1. Top Section: 3 Visual Boxes */}
            <div className="px-4 md:px-0">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                    {visualStats.map((stat, idx) => (
                        <div key={idx} className={`${stat.bg} ${idx === 2 ? 'col-span-2 md:col-span-1' : ''} rounded-2xl p-4 md:p-6 flex flex-col items-center text-center shadow-sm border border-white/50 relative overflow-hidden group`}>
                            <div className="h-10 w-10 md:h-20 md:w-20 mb-2 md:mb-4 relative z-10">
                                <img
                                    src={stat.image}
                                    alt={stat.title}
                                    className="w-full h-full object-contain drop-shadow-sm transition-transform group-hover:scale-110 duration-300"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </div>
                            <h3 className="text-xs md:text-sm font-bold text-slate-700 leading-tight mb-1">{stat.title}</h3>
                            <p className="text-xl md:text-3xl font-extrabold text-slate-900 leading-tight text-center break-words w-full px-1">
                                {stat.value}
                            </p>
                            <p className="hidden md:block text-xs text-slate-500 font-medium">{stat.sub}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 md:px-0">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button
                        onClick={() => setShowPatientModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm shadow-blue-200"
                    >
                        <UserPlus size={20} />
                        <span className="font-semibold">Add New Patient</span>
                    </button>
                    <button
                        onClick={() => router.push('/appointments')}
                        className="bg-teal-500 hover:bg-teal-600 text-white p-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm shadow-teal-200"
                    >
                        <Calendar size={20} />
                        <span className="font-semibold">View Appointments</span>
                    </button>
                    <button
                        onClick={() => router.push('/prescriptions/new')}
                        className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl flex items-center justify-center gap-3 transition-colors shadow-sm shadow-purple-200"
                    >
                        <FileText size={20} />
                        <span className="font-semibold">Create Prescription</span>
                    </button>
                </div>
            </div>

            {/* 2. Main Section: Comprehensive Appointments Table */}
            <div className="px-4 md:px-0">
                <ComprehensiveAppointmentTable />
            </div>

            {/* 3. Bottom Section: Ratings & Feedback - REMOVED */}
        </div>
    );
}
