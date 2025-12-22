"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Loader2,
    Pill,
    Calendar,
    ChevronRight,
    FileText,
    Download,
} from "lucide-react";
import { getMyPrescriptions } from "@/actions/prescription";

const MedicalRecordsPage = () => {
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecords = async () => {
        try {
            const data = await getMyPrescriptions();
            setPrescriptions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Failed to fetch prescriptions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
        const interval = setInterval(fetchRecords, 7000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-500" />
            </div>
        );
    }

    const recent = prescriptions.slice(0, 3);
    const history = prescriptions.slice(3);

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
            {/* Header is handled by Navbar.jsx now for full-width support */}

            {/* ===== Content ===== */}
            <div className="p-5 space-y-8">
                {/* Empty State */}
                {prescriptions.length === 0 && (
                    <div className="flex flex-col items-center text-center py-20">
                        <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6">
                            <FileText size={40} className="text-blue-500 opacity-60" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800">
                            No medical records yet
                        </h2>
                        <p className="text-xs text-slate-500 mt-2 max-w-[260px]">
                            Prescriptions will appear automatically after your doctor visits.
                        </p>
                    </div>
                )}

                {/* Recent */}
                {recent.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">
                            Recent
                        </h3>
                        <div className="space-y-4">
                            {recent.map((pres) => (
                                <PrescriptionCard key={pres._id} pres={pres} />
                            ))}
                        </div>
                    </section>
                )}

                {/* History */}
                {history.length > 0 && (
                    <section>
                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-4">
                            History
                        </h3>
                        <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-0 before:w-px before:bg-slate-200">
                            {history.map((pres) => (
                                <HistoryCard key={pres._id} pres={pres} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
};

/* ===================== COMPONENTS ===================== */

const PrescriptionCard = ({ pres }) => {
    const isNew =
        new Date() - new Date(pres.createdAt) < 60 * 60 * 1000;

    return (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm relative">
            {isNew && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-bl-xl font-bold">
                    NEW
                </span>
            )}

            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {pres.doctorSnapshot?.name?.[0] || "D"}
                </div>

                <div>
                    <h3 className="font-bold text-slate-900">
                        {pres.doctorSnapshot?.name || "Doctor"}
                    </h3>
                    <p className="text-blue-600 text-xs font-semibold">
                        {pres.doctorSnapshot?.speciality || "Specialist"}
                    </p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                        <Calendar size={10} />
                        {new Date(pres.date).toDateString()}
                    </p>
                </div>
            </div>

            {/* Diagnosis */}
            <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                    Diagnosis
                </p>
                <p className="text-sm font-semibold text-slate-700">
                    {pres.diagnosis || "—"}
                </p>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg text-slate-600">
                    <Pill size={12} />
                    {pres.medicines?.length || 0} Medicines
                </div>

                <div className="flex gap-2">
                    <button className="text-xs font-bold text-blue-600 px-3 py-1.5 hover:bg-blue-50 rounded-lg flex items-center gap-1">
                        View <ChevronRight size={14} />
                    </button>
                    <button className="text-xs font-bold text-slate-500 px-3 py-1.5 hover:bg-slate-50 rounded-lg flex items-center gap-1">
                        <Download size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const HistoryCard = ({ pres }) => {
    return (
        <div className="relative pl-10">
            <div className="absolute left-[11px] top-6 w-3 h-3 bg-white border-2 border-slate-300 rounded-full"></div>

            <div className="bg-white rounded-2xl p-4 border border-slate-100 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-sm text-slate-800">
                        {pres.diagnosis}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(pres.date).toDateString()} •{" "}
                        {pres.doctorSnapshot?.name}
                    </p>
                </div>

                <ChevronRight size={16} className="text-slate-400" />
            </div>
        </div>
    );
};

export default MedicalRecordsPage;
