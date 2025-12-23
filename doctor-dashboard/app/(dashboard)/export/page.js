"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { Download, FileSpreadsheet, FileText, Database, Calendar, File, DollarSign, CheckSquare, Square, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExportPage() {
    const [selectedTypes, setSelectedTypes] = useState(['patients', 'appointments', 'prescriptions', 'earnings']);
    const [dateRange, setDateRange] = useState('all_time');
    const [format, setFormat] = useState('excel');
    const [loading, setLoading] = useState(false);

    const toggleType = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };

    const handleExport = async () => {
        setLoading(true);
        try {
            const doctorId = localStorage.getItem('doctor_id');
            const typesParams = selectedTypes.join(',');

            // Trigger download via window location or blob
            // For file download, standard fetch blob pattern is better
            const response = await fetch(`http://localhost:8000/api/export/download?doctorId=${doctorId}&format=${format}&range=${dateRange}&types=${typesParams}`, {
                method: 'GET',
                headers: {
                    // Auth token if needed
                }
            });

            if (!response.ok) throw new Error('Export failed');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = format === 'excel' ? 'clinic_data.xlsx' : 'clinic_report.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            console.error("Export failed", error);
            alert("Export failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-24 md:pb-8 max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Data Export</h1>
                <p className="text-slate-500 mt-1">Export your clinic data for backup or analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Select Data */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">Select Data to Export</h3>
                    <div className="space-y-3">
                        {[
                            { id: 'patients', label: 'Patients Database', desc: 'All patient records and information', icon: Database },
                            { id: 'appointments', label: 'Appointments', desc: 'Appointment history and schedules', icon: Calendar },
                            { id: 'prescriptions', label: 'Prescriptions', desc: 'All prescription records', icon: File },
                            { id: 'earnings', label: 'Earnings & Transactions', desc: 'Financial records and payments', icon: DollarSign },
                        ].map((item) => {
                            const Icon = item.icon;
                            const isSelected = selectedTypes.includes(item.id);
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => toggleType(item.id)}
                                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    <div className={`mt-1 ${isSelected ? 'text-blue-600' : 'text-slate-300'}`}>
                                        {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Icon size={16} className="text-slate-500" />
                                            <span className={`font-bold ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{item.label}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Disabled items */}
                        <div className="flex items-start gap-3 p-3 rounded-xl border border-dashed border-slate-200 opacity-60">
                            <div className="mt-1 text-slate-300"><Square size={20} /></div>
                            <div>
                                <span className="font-bold text-slate-400">Referrals</span>
                                <p className="text-xs text-slate-400">Specialist referral records</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* 2. Date Range */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Date Range</h3>
                        <div className="space-y-3">
                            {[
                                { id: 'all_time', label: 'All Time', desc: 'Export complete history' },
                                { id: 'last_12_months', label: 'Last 12 Months', desc: 'Current year data' },
                                { id: 'last_30_days', label: 'Last 30 Days', desc: 'Recent month only' },
                            ].map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => setDateRange(option.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${dateRange === option.id ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${dateRange === option.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                        {dateRange === option.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-slate-800">{option.label}</p>
                                        <p className="text-xs text-slate-500">{option.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 3. Export Format */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4">Export Format</h3>
                        <div className="space-y-3">
                            <div
                                onClick={() => setFormat('excel')}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${format === 'excel' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${format === 'excel' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                    {format === 'excel' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-slate-800">Excel (.xlsx)</p>
                                    <p className="text-xs text-slate-500">Best for analysis in Excel/Sheets</p>
                                </div>
                            </div>

                            <div
                                onClick={() => setFormat('pdf')}
                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${format === 'pdf' ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-slate-100 hover:border-slate-200'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${format === 'pdf' ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
                                    {format === 'pdf' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-slate-800">PDF (.pdf)</p>
                                    <p className="text-xs text-slate-500">Print-ready format</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary & Action */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-slate-800 mb-1">Export Summary</h3>
                        <div className="space-y-1 text-sm text-slate-600">
                            <p>📊 <b>{selectedTypes.length}</b> data type(s) selected</p>
                            <p>📅 Date range: <b>{dateRange.replace(/_/g, ' ')}</b></p>
                            <p>📄 Format: <b>{format.toUpperCase()}</b></p>
                        </div>
                    </div>
                </div>
            </div>

            <Button
                onClick={handleExport}
                disabled={loading || selectedTypes.length === 0}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Generating File...' : `Export Data (${selectedTypes.length} items)`}
                {!loading && <Download size={20} className="ml-2" />}
            </Button>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                    <h4 className="text-amber-800 font-bold text-sm">Data Privacy Note</h4>
                    <p className="text-amber-700 text-xs mt-1">
                        Exported data contains sensitive patient information. Please ensure proper security measures when storing or sharing these files. SehatNxt+ is not responsible for data breaches after export.
                    </p>
                </div>
            </div>
        </div>
    );
}
