"use client";
import React, { useState, useEffect } from 'react';
import { Search, Plus, Trash2, Save, ArrowLeft, Loader2, FileText, Share2, Printer, Mic } from 'lucide-react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Quick Templates
const QUICK_TEMPLATES = [
    {
        title: "Common Cold & Fever",
        count: "2 medicines",
        icon: FileText,
        data: {
            diagnosis: "Viral Fever & Cold",
            medicines: [
                { name: "Paracetamol 650mg", dosage: "1-0-1", duration: "3 days", frequency: "After Food", instruction: "For fever" },
                { name: "Cetirizine 10mg", dosage: "0-0-1", duration: "5 days", frequency: "After Food", instruction: "For cold" }
            ],
            advice: "Drink warm water, take rest, avoid cold foods."
        }
    },
    {
        title: "Hypertension Follow-up",
        count: "2 medicines",
        icon: FileText,
        data: {
            diagnosis: "Essential Hypertension",
            medicines: [
                { name: "Telmisartan 40mg", dosage: "1-0-0", duration: "30 days", frequency: "Before Food", instruction: "Daily morning" },
                { name: "Amlodipine 5mg", dosage: "0-0-1", duration: "30 days", frequency: "After Food", instruction: "If BP > 140/90" }
            ],
            advice: "Reduce salt intake, daily walk for 30 mins."
        }
    },
    {
        title: "Diabetes Management",
        count: "2 medicines",
        icon: FileText,
        data: {
            diagnosis: "Type 2 Diabetes Mellitus",
            medicines: [
                { name: "Metformin 500mg", dosage: "1-0-1", duration: "30 days", frequency: "After Food", instruction: "" },
                { name: "Glimepiride 1mg", dosage: "1-0-0", duration: "30 days", frequency: "Before Food", instruction: "" }
            ],
            advice: "Avoid sugar/sweets, regular foot care, monitor blood sugar weekly."
        }
    }
];

export default function CreatePrescriptionPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [patientRaw, setPatientRaw] = useState({ age: '', gender: '' }); // Manual entry if needed
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [advice, setAdvice] = useState('');
    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', duration: '', frequency: '', instruction: '' }
    ]);

    // Current Date
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    // Patient Search Effect
    useEffect(() => {
        const fetchPatients = async () => {
            if (search.length < 2) return;
            setLoadingPatients(true);
            try {
                const res = await axios.get(`http://localhost:8000/api/patients?search=${search}`);
                setPatients(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingPatients(false);
            }
        };
        const debounce = setTimeout(fetchPatients, 500);
        return () => clearTimeout(debounce);
    }, [search]);

    // Load Template
    const loadTemplate = (template) => {
        setDiagnosis(template.diagnosis);
        setMedicines(template.medicines);
        setAdvice(template.advice);
    };

    // Medicine Handlers
    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', duration: '', frequency: '', instruction: '' }]);
    };
    const removeMedicine = (index) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };
    const updateMedicine = (index, field, value) => {
        const newMeds = [...medicines];
        newMeds[index][field] = value;
        setMedicines(newMeds);
    };

    // Submit
    const handleSubmit = async () => {
        if (!selectedPatient) return alert("Select a patient first");
        setSubmitting(true);
        try {
            const doctorId = localStorage.getItem('doctor_id');
            await axios.post('http://localhost:8000/api/prescriptions', {
                doctorId,
                patientId: selectedPatient._id,
                diagnosis,
                advice,
                medicines
            });
            router.push('/dashboard/prescriptions');
        } catch (err) {
            console.error(err);
            alert("Failed to save prescription");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-[1400px] mx-auto pb-20 md:pb-8">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Create Prescription</h1>
                <p className="text-slate-500">Generate prescription for your patient</p>
            </div>

            {/* Quick Load Templates */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6">
                <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-700">
                    <FileText size={16} className="text-blue-600" /> Quick Load: Common Prescriptions
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {QUICK_TEMPLATES.map((tmpl, idx) => (
                        <div
                            key={idx}
                            onClick={() => loadTemplate(tmpl.data)}
                            className="bg-white p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer flex items-center gap-3 group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <tmpl.icon size={16} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{tmpl.title}</h4>
                                <p className="text-[10px] text-slate-500">{tmpl.count}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT COLUMN: FORM */}
                <div className="lg:col-span-7 space-y-6">

                    {/* Patient Info Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">Patient Information</h3>

                        <div className="mb-4">
                            <label className="text-xs font-semibold text-slate-500 mb-1 block">Select Patient</label>
                            {selectedPatient ? (
                                <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                            {selectedPatient.name[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm">{selectedPatient.name}</p>
                                            <p className="text-[10px] text-slate-500">{selectedPatient.phone}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setSelectedPatient(null)} className="text-xs text-red-600 font-medium hover:underline p-1">Change</button>
                                </div>
                            ) : (
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                    <input
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50/50"
                                        placeholder="Search or select patient..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    {/* Dropdown Results */}
                                    {search.length > 1 && (
                                        <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-xl mt-1 max-h-40 overflow-y-auto z-20">
                                            {loadingPatients ? (
                                                <div className="p-3 text-xs text-slate-400 text-center">Loading...</div>
                                            ) : (
                                                patients.map(p => (
                                                    <div key={p._id} onClick={() => { setSelectedPatient(p); setSearch(''); }} className="p-2.5 hover:bg-slate-50 cursor-pointer border-b last:border-0">
                                                        <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                                                        <p className="text-[10px] text-slate-500">{p.phone} • {p.age} yrs</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Age</label>
                                <input
                                    className="w-full p-2.5 rounded-xl border border-slate-200 text-sm outline-none bg-slate-50/50"
                                    placeholder="Enter age"
                                    value={selectedPatient?.age || patientRaw.age}
                                    readOnly={!!selectedPatient}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Gender</label>
                                <div className="w-full p-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50/50 text-slate-600">
                                    {selectedPatient?.gender || "Select"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Diagnosis Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 text-sm">Symptoms & Diagnosis</h3>
                            <button className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-blue-700 transition">
                                <Mic size={12} /> Voice Input
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Symptoms</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 min-h-[60px] bg-slate-50/30"
                                    placeholder="Enter patient symptoms..."
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-slate-500 mb-1 block">Diagnosis</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 min-h-[60px] bg-slate-50/30"
                                    placeholder="Enter diagnosis..."
                                    value={diagnosis}
                                    onChange={(e) => setDiagnosis(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medicines Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 text-sm">Medicines</h3>
                            <button onClick={addMedicine} className="flex items-center gap-1 bg-teal-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:bg-teal-700 transition">
                                <Plus size={14} /> Add Medicine
                            </button>
                        </div>

                        {/* Smart Search Banner */}
                        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 flex gap-3">
                            <FileText size={18} className="text-blue-500 shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-700 leading-relaxed">
                                <span className="font-bold">Smart Medicine Search:</span> Type any letter to see matching medicines. Try "P" for Paracetamol, "A" for Azithromycin, etc.
                            </p>
                        </div>

                        {/* Column Headers */}
                        <div className="grid grid-cols-12 gap-2 mb-2 px-1">
                            <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase">Medicine Name</div>
                            <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase">Dosage</div>
                            <div className="col-span-3 text-[10px] font-bold text-slate-400 uppercase">Duration</div>
                            <div className="col-span-1"></div>
                        </div>

                        <div className="space-y-2">
                            {medicines.map((med, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center group">
                                    <div className="col-span-5">
                                        <input
                                            placeholder="Type medicine name..."
                                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-300 outline-none transition-all"
                                            value={med.name}
                                            onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            placeholder="1-0-1"
                                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-300 outline-none transition-all text-center"
                                            value={med.dosage}
                                            onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            placeholder="5 days"
                                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm bg-slate-50/50 focus:bg-white focus:border-blue-300 outline-none transition-all"
                                            value={med.duration}
                                            onChange={(e) => updateMedicine(idx, 'duration', e.target.value)}
                                        />
                                    </div>
                                    <div className="col-span-1 flex justify-center">
                                        <button onClick={() => removeMedicine(idx)} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Advice Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-bold text-slate-800 text-sm mb-3">Advice & Notes for Patient</h3>
                        <textarea
                            className="w-full border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-100 min-h-[80px] bg-slate-50/30"
                            placeholder="Enter any advice or special notes for the patient..."
                            value={advice}
                            onChange={(e) => setAdvice(e.target.value)}
                        />
                        <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-400">
                            <div className="w-3 h-3 rounded-full bg-yellow-400/50"></div>
                            This will be printed on the prescription and shown in the preview
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: PREVIEW */}
                <div className="lg:col-span-5">
                    <div className="sticky top-6">
                        <h3 className="font-bold text-slate-800 mb-4 text-sm">Prescription Preview</h3>

                        {/* A4 Paper Preview */}
                        <div className="bg-white rounded-lg shadow-xl border border-slate-100 min-h-[600px] p-8 flex flex-col relative print-container">

                            {/* Watermark/Logo Background (Optional) */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                                <img src="/logo.png" className="w-64 grayscale" alt="" />
                            </div>

                            {/* Header */}
                            <div className="border-b border-slate-200 pb-6 mb-6 text-center space-y-1 z-10">
                                <div className="flex justify-center mb-4">
                                    <img src="/logo.png" className="h-10" alt="Logo" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-900">Dr. Sharma, MBBS, MD</h2>
                                <p className="text-xs text-slate-500">Reg. No: 12345</p>
                                <p className="text-xs text-slate-500">Sharma Clinic, MG Road, Mumbai</p>
                                <p className="text-xs text-slate-500">Contact: +91 98765 43210</p>
                            </div>

                            {/* Patient Details */}
                            <div className="border border-slate-200 rounded-lg p-4 mb-6 z-10 bg-slate-50/30">
                                <div className="grid grid-cols-2 gap-y-2 text-xs">
                                    <p className="text-slate-500">Patient: <span className="font-bold text-slate-900">{selectedPatient ? selectedPatient.name : "-"}</span></p>
                                    <p className="text-slate-500 text-right">Date: <span className="font-bold text-slate-900">{today}</span></p>
                                    <p className="text-slate-500">Age/Gender: <span className="font-bold text-slate-900">{selectedPatient ? `${selectedPatient.age} / ${selectedPatient.gender}` : "-"}</span></p>
                                    <p className="text-slate-500 text-right">Patient ID: <span className="font-bold text-slate-900">{selectedPatient ? selectedPatient._id.slice(-6).toUpperCase() : "-"}</span></p>
                                </div>
                            </div>

                            {/* Rx Section */}
                            <div className="flex-1 z-10">
                                <h3 className="text-blue-600 font-bold text-lg mb-4 flex items-center gap-2">
                                    <span className="text-2xl font-serif">Rx</span> Prescription
                                </h3>

                                {medicines.length === 0 || (medicines.length === 1 && !medicines[0].name) ? (
                                    <p className="text-sm text-slate-400 italic p-4 text-center">No medicines added yet</p>
                                ) : (
                                    <ul className="space-y-4">
                                        {medicines.map((med, idx) => med.name && (
                                            <li key={idx} className="border-b border-dashed border-slate-100 pb-3 last:border-0">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{idx + 1}. {med.name}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">
                                                            {med.instruction || med.frequency || "As directed"}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs font-bold text-slate-700">{med.dosage}</p>
                                                        <p className="text-[10px] text-slate-400">{med.duration}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Footer Signature */}
                            <div className="mt-12 pt-6 border-t border-slate-100 flex justify-end z-10">
                                <div className="text-center">
                                    {/* Mock Signature */}
                                    <div className="h-12 w-32 flex items-center justify-center text-blue-600 font-caveat text-xl">
                                        <img src="/assets/signature-placeholder.png" className="h-10 opacity-60" onError={(e) => e.target.style.display = 'none'} alt="Start Adding..." />
                                        <span className="font-handwriting text-2xl text-slate-400">Dr. Sharma</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-900 mt-1">Dr. Sharma</p>
                                    <p className="text-[10px] text-slate-500">MBBS, MD</p>
                                </div>
                            </div>

                            <div className="mt-8 text-[10px] text-center text-slate-400 border-t border-slate-100 pt-3">
                                This is a computer-generated prescription and is valid without physical signature.
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <Button onClick={handleSubmit} disabled={submitting} className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg shadow-blue-200">
                                {submitting ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                                Save Prescription
                            </Button>
                            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 py-4 font-semibold rounded-xl">
                                <Printer size={18} className="mr-2" /> Print
                            </Button>
                            <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50 py-4 font-semibold rounded-xl">
                                <Share2 size={18} className="mr-2" /> Share
                            </Button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
