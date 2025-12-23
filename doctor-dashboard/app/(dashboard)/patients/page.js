"use client";
import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Loader2, Download, Eye, Calendar } from 'lucide-react';
import PatientDetailsModal from '@/components/patients/PatientDetailsModal';
import AddPatientModal from '@/components/patients/AddPatientModal';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function PatientsPage() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`http://localhost:8000/api/patients?search=${searchTerm}`);
            setPatients(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(fetchPatients, 500);
        return () => clearTimeout(debounce);
    }, [searchTerm]);

    return (
        <div className="space-y-6 pb-24 md:pb-8 relative min-h-screen">
            <AddPatientModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSuccess={fetchPatients} />
            <PatientDetailsModal isOpen={!!selectedPatient} onClose={() => setSelectedPatient(null)} patient={selectedPatient} />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
                    <p className="text-slate-500 mt-1">Manage patient records & history</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="border-slate-200 text-slate-600 font-semibold rounded-xl flex-1 md:flex-none" title="Bulk Import Comming Soon">
                        <Download size={18} className="mr-2" /> Import
                    </Button>
                    <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-200 flex-1 md:flex-none">
                        <UserPlus size={18} className="mr-2" /> Add Patient
                    </Button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, ID or phone..."
                        className="w-full pl-12 pr-4 py-4 rounded-xl border-none outline-none text-slate-700 font-medium placeholder:text-slate-400 bg-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Content: Grid Layout */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
                    ))}
                </div>
            ) : patients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100 border-dashed">
                    <div className="bg-slate-50 p-4 rounded-full mb-4">
                        <UserPlus size={32} className="text-slate-300" />
                    </div>
                    <p className="text-lg font-bold text-slate-600">No patients found</p>
                    <p className="text-slate-400 text-sm">Try adding a new patient</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {patients.map(patient => (
                        <div key={patient._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between h-auto min-h-[280px]">
                            {/* Top: Avatar & Name */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-blue-200 shadow-lg shrink-0">
                                    {patient.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-slate-900 truncate">{patient.name}</h3>
                                    <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {patient._id.slice(-6).toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Middle: Stats grid */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm mb-6 flex-1">
                                <div className="col-span-2 flex justify-between border-b border-slate-50 pb-2">
                                    <span className="text-slate-400 font-medium">Age</span>
                                    <span className="font-bold text-slate-700">{patient.age || 'N/A'} years</span>
                                </div>
                                <div className="col-span-2 flex justify-between border-b border-slate-50 pb-2">
                                    <span className="text-slate-400 font-medium">Last Visit</span>
                                    <span className="font-bold text-slate-700 flex items-center gap-1">
                                        <Calendar size={12} className="text-slate-400" />
                                        {/* Mock or Real Last Visit - requires backend aggregation normally */}
                                        {/* For now, simplified or "No visits" if not populated */}
                                        {/* We filter createdAt or just show N/A for speed if not aggregated */}
                                        {new Date(patient.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-between">
                                    <span className="text-slate-400 font-medium">Diagnosis</span>
                                    <span className="font-bold text-slate-900 text-right truncate pl-2 max-w-[150px]">
                                        {/* Getting latest diagnosis requires extra query or hydration */}
                                        {/* Just for UI fidelity */}
                                        Check History
                                    </span>
                                </div>
                            </div>

                            {/* Bottom: Action */}
                            <Button
                                onClick={() => setSelectedPatient(patient)}
                                className="w-full bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-5 rounded-xl transition-colors"
                            >
                                <Eye size={18} className="mr-2" /> View Details
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
