"use client";
import React from 'react';
import { X, Calendar, Clock, User, FileText, CheckCircle, XCircle, RotateCw } from 'lucide-react';

export default function PatientDetailDrawer({ isOpen, onClose, patient }) {
    if (!isOpen || !patient) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="relative w-full md:w-[480px] bg-white h-full shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 border-b border-slate-100 p-5 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-900">Patient Details</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Patient Profile */}
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-200">
                            {patient.name.charAt(0)}
                        </div>
                        <div className="flex-1 pt-1">
                            <h3 className="text-2xl font-bold text-slate-900 leading-tight">{patient.name}</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-medium text-slate-600">{patient.age} yrs • {patient.gender}</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold font-mono tracking-wide border border-blue-100">{patient.tokenId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Appointment Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <Calendar size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Date</span>
                            </div>
                            <p className="font-semibold text-slate-800">Today, Oct 24</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <Clock size={16} />
                                <span className="text-xs font-semibold uppercase tracking-wider">Time</span>
                            </div>
                            <p className="font-semibold text-slate-800">{patient.appointmentTime}</p>
                        </div>
                    </div>

                    {/* Symptoms & Notes */}
                    <div className="space-y-4">
                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                                <User size={18} className="text-blue-500" /> Current Symptoms
                            </h4>
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-sm leading-relaxed">
                                {patient.symptoms}
                            </div>
                        </div>

                        <div>
                            <h4 className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                                <FileText size={18} className="text-blue-500" /> Doctor&apos;s Notes (Previous)
                            </h4>
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-600 text-sm leading-relaxed">
                                {patient.notes}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 gap-3 pt-4 border-t border-slate-100">
                        <button className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-100 transition-all active:scale-[0.98]">
                            <CheckCircle size={20} />
                            Mark as Completed
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl transition-all">
                                <RotateCw size={18} />
                                Reschedule
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 bg-white border border-red-100 hover:bg-red-50 text-red-600 font-semibold rounded-xl transition-all">
                                <XCircle size={18} />
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
