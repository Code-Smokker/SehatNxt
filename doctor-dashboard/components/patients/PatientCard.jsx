"use client";
import React from 'react';
import { Video, MapPin, ChevronRight, Clock } from 'lucide-react';

export default function PatientCard({ patient, onClick }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Waiting': return 'text-amber-600 bg-amber-50';
            case 'Completed': return 'text-green-600 bg-green-50';
            case 'Cancelled': return 'text-red-600 bg-red-50';
            default: return 'text-slate-600 bg-slate-50';
        }
    };

    return (
        <div
            onClick={onClick}
            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-lg border border-slate-100">
                        {patient.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg leading-tight">{patient.name}</h3>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{patient.age} yrs • {patient.gender}</p>
                    </div>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(patient.status)}`}>
                    {patient.status}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/50">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Token ID</p>
                    <p className="font-mono text-sm font-bold text-slate-700">{patient.tokenId}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100/50">
                    <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Time</p>
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-blue-500" />
                        <p className="font-bold text-sm text-slate-700">{patient.appointmentTime}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                    {patient.visitType === 'Video' ? <Video size={14} className="text-purple-500" /> : <MapPin size={14} className="text-orange-500" />}
                    {patient.visitType} Visit
                </div>
                <div className="flex items-center text-blue-600 text-xs font-bold gap-1">
                    View Details <ChevronRight size={14} />
                </div>
            </div>
        </div>
    );
}
