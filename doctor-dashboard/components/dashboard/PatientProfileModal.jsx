"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, User, Calendar, Activity, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PatientProfileModal({ patient, onClose, onAddVisit, onPrescribe }) {
    const [activeTab, setActiveTab] = useState('history');
    const [history, setHistory] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!patient) return;
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch Appointments History
                const aptRes = await axios.get(`http://localhost:8000/api/appointments/user/${patient._id}`);
                setHistory(aptRes.data);

                // Fetch Prescriptions
                const prescRes = await axios.get(`http://localhost:8000/api/prescriptions/patient/${patient._id}`);
                setPrescriptions(prescRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [patient]);

    if (!patient) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col relative animate-in fade-in zoom-in-95 shadow-2xl overflow-hidden">
                <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 z-10 bg-white rounded-full p-1">
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="p-6 bg-slate-50 border-b flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white shadow-sm">
                        {patient.name[0]}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{patient.name}</h2>
                        <div className="text-sm text-slate-500 mt-1 flex gap-3">
                            <span>{patient.age} Years</span>
                            <span>•</span>
                            <span>{patient.gender}</span>
                            <span>•</span>
                            <span>{patient.phone}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                            < Button size="sm" onClick={() => onAddVisit(patient)} className="bg-blue-600 hover:bg-blue-700 text-white border-0 gap-2">
                                <Calendar size={14} /> Add Visit
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => onPrescribe(patient)} className="text-purple-600 border-purple-200 hover:bg-purple-50 gap-2">
                                <FileText size={14} /> Create Prescription
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b px-6">
                    {['history', 'prescriptions', 'vitals'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="animate-spin text-slate-400" /></div>
                    ) : (
                        <>
                            {activeTab === 'history' && (
                                <div className="space-y-4">
                                    {history.length === 0 ? <p className="text-slate-400 text-center py-8">No visit history.</p> : history.map(apt => (
                                        <div key={apt._id} className="border rounded-xl p-4 hover:bg-slate-50 flex justify-between items-center group transition-colors">
                                            <div>
                                                <div className="font-semibold text-slate-800">{new Date(apt.date).toLocaleDateString()}</div>
                                                <div className="text-sm text-slate-500">{apt.problem}</div>
                                            </div>
                                            <Badge className={apt.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}>{apt.status}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'prescriptions' && (
                                <div className="space-y-4">
                                    {prescriptions.length === 0 ? <p className="text-slate-400 text-center py-8">No prescriptions found.</p> : prescriptions.map(p => (
                                        <div key={p._id} className="border rounded-xl p-4 hover:bg-slate-50">
                                            <div className="font-semibold text-slate-800 mb-2">{new Date(p.createdAt).toLocaleDateString()}</div>
                                            <div className="text-sm text-slate-600">{p.diagnosis}</div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {p.medicines.map((m, i) => (
                                                    <span key={i} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600 border">{m.name}</span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'vitals' && (
                                <div className="text-center py-12 text-slate-400">
                                    <Activity className="mx-auto mb-2 opacity-50" />
                                    <p>Vitals tracking coming soon.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// Helper Badge component just in case
const Badge = ({ children, className }) => <span className={`px-2 py-0.5 rounded text-xs font-semibold ${className}`}>{children}</span>;
