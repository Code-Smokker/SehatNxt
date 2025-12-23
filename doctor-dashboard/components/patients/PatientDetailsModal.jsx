"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, FileText, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function PatientDetailsModal({ isOpen, onClose, patient }) {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isOpen && patient) {
            fetchHistory();
        }
    }, [isOpen, patient]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            // Re-using appointment route "GET /api/appointments/user/:userId" if accessible
            // Or better: Create a specific route or filter client side if simplistic
            // Since we need doctor-specific history or all history? Usually doctor specific.
            // Using endpoint: GET /api/appointments/user/:userId but verify current auth.
            // Actually, doctor should be able to see appointments with THIS doctor.
            // Let's filter client side or use existing route.
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:8000/api/appointments/user/${patient._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAppointments(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen || !patient) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] md:h-auto overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-200">

                {/* Left: Patient Profile */}
                <div className="w-full md:w-1/3 bg-slate-50 p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col">
                    <div className="flex justify-between md:hidden mb-4">
                        <h2 className="font-bold">Details</h2>
                        <button onClick={onClose}><X size={24} /></button>
                    </div>

                    <div className="text-center mb-6">
                        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-bold mx-auto mb-4 border-4 border-white shadow-sm">
                            {patient.name[0]}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">{patient.name}</h2>
                        <p className="text-sm text-slate-500 font-mono">ID: {patient._id.slice(-6).toUpperCase()}</p>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                            <p className="text-xs text-slate-400 uppercase font-bold mb-1">Contact Info</p>
                            <p className="font-semibold text-slate-800">{patient.phone}</p>
                            <p className="text-sm text-slate-500">{patient.email || "No email"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 font-bold">Age</p>
                                <p className="font-bold text-slate-800">{patient.age || '-'}</p>
                            </div>
                            <div className="bg-white p-3 rounded-xl border border-slate-100 text-center">
                                <p className="text-xs text-slate-400 font-bold">Gender</p>
                                <p className="font-bold text-slate-800">{patient.gender || '-'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: History & Actions */}
                <div className="w-full md:w-2/3 p-6 flex flex-col bg-white h-full relative">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full text-slate-400 hidden md:block">
                        <X size={20} />
                    </button>

                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Clock size={20} className="text-blue-500" /> History
                        </h3>
                        <div className="flex gap-2">
                            <Button onClick={() => router.push('/prescriptions/new')} className="bg-teal-600 hover:bg-teal-700 text-white h-9 text-xs rounded-lg">
                                <FileText size={14} className="mr-1" /> New Prescription
                            </Button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                        {loading ? (
                            <div className="text-center py-10 text-slate-400 text-sm">Loading history...</div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                <p className="text-slate-500 font-medium">No prior visits found</p>
                            </div>
                        ) : (
                            appointments.map(apt => (
                                <div key={apt._id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{new Date(apt.date).toLocaleDateString('en-GB')}</p>
                                            <p className="text-xs text-slate-500">{apt.problem || "General Checkup"}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${apt.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                            {apt.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-400">
                                        <Calendar size={12} />
                                        {new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        {/* Future: Add 'View Prescription' link if exists */}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
