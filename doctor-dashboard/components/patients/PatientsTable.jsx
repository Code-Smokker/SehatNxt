"use client";
import React from 'react';
import { Eye, Video, MapPin } from 'lucide-react';

export default function PatientsTable({ patients, onViewDetails }) {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Waiting': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Completed': return 'bg-green-50 text-green-700 border-green-100';
            case 'Cancelled': return 'bg-red-50 text-red-700 border-red-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                        <th className="p-5 font-semibold text-sm text-slate-500">Patient Info</th>
                        <th className="p-5 font-semibold text-sm text-slate-500">Token ID</th>
                        <th className="p-5 font-semibold text-sm text-slate-500">Time</th>
                        <th className="p-5 font-semibold text-sm text-slate-500">Visit Type</th>
                        <th className="p-5 font-semibold text-sm text-slate-500">Status</th>
                        <th className="p-5 font-semibold text-sm text-slate-500 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {patients.map((patient) => (
                        <tr
                            key={patient.id}
                            onClick={() => onViewDetails(patient)}
                            className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                        >
                            <td className="p-5">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                                        {patient.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{patient.name}</p>
                                        <p className="text-xs text-slate-500">{patient.age} yrs, {patient.gender}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-5">
                                <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                    {patient.tokenId}
                                </span>
                            </td>
                            <td className="p-5">
                                <span className="font-medium text-slate-700">{patient.appointmentTime}</span>
                            </td>
                            <td className="p-5">
                                <div className="flex items-center gap-2">
                                    {patient.visitType === 'Video' ?
                                        <Video size={16} className="text-purple-500" /> :
                                        <MapPin size={16} className="text-orange-500" />
                                    }
                                    <span className="text-sm text-slate-600">{patient.visitType}</span>
                                </div>
                            </td>
                            <td className="p-5">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(patient.status)}`}>
                                    {patient.status}
                                </span>
                            </td>
                            <td className="p-5 text-right">
                                <button className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                                    <Eye size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
