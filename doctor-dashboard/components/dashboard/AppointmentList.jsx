"use client";
import React from 'react';
import { MoreVertical, Video, MapPin, Calendar, Clock } from 'lucide-react';
import { MOCK_DATA } from '@/lib/mockData';

export default function AppointmentList() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Upcoming Appointments</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>

            <div className="divide-y divide-slate-50 overflow-y-auto">
                {MOCK_DATA.appointments.map((apt) => (
                    <div key={apt.id} className="p-4 hover:bg-slate-50/50 transition-colors flex gap-4 items-center">
                        <div className="relative shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={apt.image} alt={apt.patient} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 truncate">{apt.patient}</h4>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                <span className="flex items-center gap-1"><Clock size={12} /> {apt.time}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{apt.type}</span>
                            </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                            {apt.mode === 'Video Consult' ? (
                                <button className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors">
                                    <Video size={18} />
                                </button>
                            ) : (
                                <button className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors">
                                    <MapPin size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
