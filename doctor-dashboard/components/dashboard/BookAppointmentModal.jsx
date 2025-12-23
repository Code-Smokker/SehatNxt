"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Loader2, Calendar } from 'lucide-react';

export default function BookAppointmentModal({ onClose, onSuccess }) {
    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);

    // Form Data
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [problem, setProblem] = useState('');
    const [type, setType] = useState('Clinic');
    const [submitting, setSubmitting] = useState(false);

    // Fetch patients on search
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPatient) return alert("Please select a patient");

        setSubmitting(true);
        try {
            const doctorId = localStorage.getItem('doctor_id');
            await axios.post('http://localhost:8000/api/appointments/book', {
                userId: selectedPatient._id, // User Panel uses userId
                patientId: selectedPatient._id, // Some routes might use patientId
                doctorId,
                doctorInfo: { id: doctorId }, // Legacy support if needed
                userInfo: { name: selectedPatient.name }, // Legacy
                date,
                slotTime: time,
                time: time, // Redundant but safe
                problem,
                type
            });
            onSuccess();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200 shadow-2xl">
                <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Calendar className="text-blue-600" /> Book Appointment
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Patient Search */}
                    <div className="relative">
                        <label className="text-sm font-medium text-slate-700 block mb-1">Select Patient</label>
                        <input
                            className="w-full border rounded-lg p-2.5 bg-slate-50 outline-none focus:ring-2 focus:ring-blue-100"
                            placeholder="Search by name or phone..."
                            value={selectedPatient ? selectedPatient.name : search}
                            onChange={(e) => { setSearch(e.target.value); setSelectedPatient(null); }}
                            required
                        />
                        {/* Dropdown */}
                        {search && !selectedPatient && patients.length > 0 && (
                            <div className="absolute top-full left-0 w-full bg-white border rounded-lg shadow-xl mt-1 max-h-48 overflow-y-auto z-10">
                                {patients.map(p => (
                                    <div key={p.id}
                                        onClick={() => { setSelectedPatient(p); setSearch(''); }}
                                        className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-0"
                                    >
                                        <p className="font-semibold text-slate-800">{p.name}</p>
                                        <p className="text-xs text-slate-500">{p.phone} • {p.gender}, {p.age}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        {loadingPatients && <div className="absolute right-3 top-9 text-slate-400 text-xs">Searching...</div>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Date</label>
                            <input type="date" required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                                value={date} onChange={(e) => setDate(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Time</label>
                            <input type="time" required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                                value={time} onChange={(e) => setTime(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">Problem / Reason</label>
                        <textarea required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100 min-h-[80px]"
                            value={problem} onChange={(e) => setProblem(e.target.value)} placeholder="e.g. Fever, Consultation..." />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">Type</label>
                        <div className="flex gap-4">
                            {['Clinic', 'Video'].map(t => (
                                <label key={t} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="w-4 h-4 text-blue-600" />
                                    <span className="text-slate-700">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex justify-center mt-4 shadow-lg shadow-blue-200">
                        {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Booking'}
                    </button>
                </form>
            </div>
        </div>
    );
}
