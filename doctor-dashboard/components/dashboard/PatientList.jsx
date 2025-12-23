"use client";
import React from 'react';
import { MOCK_DATA } from '@/lib/mockData';

export default function PatientList() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">New Patients</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>

            <div className="divide-y divide-slate-50 overflow-y-auto">
                {MOCK_DATA.patients.map((patient) => (
                    <div key={patient.id} className="p-4 hover:bg-slate-50/50 transition-colors flex gap-4 items-center">
                        <img src={patient.image} alt={patient.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{patient.name}</h4>
                            <p className="text-xs text-slate-500">{patient.condition} • {patient.age} yrs • {patient.gender}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
