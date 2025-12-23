"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, FileText, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function PrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            const doctorId = localStorage.getItem('doctor_id');
            if (!doctorId) return;
            try {
                const res = await axios.get(`http://localhost:8000/api/prescriptions/doctor/${doctorId}`);
                setPrescriptions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    const filtered = prescriptions.filter(p =>
        p.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 pb-20 md:pb-0 relative min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Prescriptions</h1>
                    <p className="text-slate-500 mt-1">View and create patient prescriptions</p>
                </div>
                <button
                    onClick={() => router.push('/prescriptions/new')}
                    className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition-colors shadow-md shadow-purple-200"
                >
                    <Plus size={18} />
                    <span>Create Prescription</span>
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Recent Prescriptions</h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-purple-100"
                            placeholder="Search patient or diagnosis..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">No prescriptions found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {filtered.map(p => (
                            <div key={p._id} className="border border-slate-100 rounded-xl p-4 hover:bg-slate-50 hover:shadow-md transition-all group cursor-pointer" onClick={() => { }}>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                            {p.patientId?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-purple-600 transition-colors">{p.patientId?.name || "Unknown"}</h4>
                                            <p className="text-xs text-slate-500">{p.patientId?.age} yrs • {p.patientId?.gender}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-mono text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="mb-3">
                                    <p className="text-sm font-semibold text-slate-700 mb-1">Diagnosis</p>
                                    <p className="text-sm text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">{p.diagnosis}</p>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <FileText size={14} className="text-purple-500" />
                                    {p.medicines.length} Medicines Prescribed
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
