"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Loader2 } from 'lucide-react';

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const res = await axios.get('/api/admin/appointments');
                setAppointments(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const filteredAppointments = appointments.filter(apt =>
        (apt.patientId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (apt.doctorId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8"><Loader2 className="animate-spin" /> Loading appointments...</div>;

    const StatusBadge = ({ status }) => {
        let colors = "bg-slate-100 text-slate-700";
        if (status === 'confirmed') colors = "bg-blue-100 text-blue-700";
        if (status === 'completed') colors = "bg-green-100 text-green-700";
        if (status === 'cancelled') colors = "bg-red-100 text-red-700";
        if (status === 'pending') colors = "bg-amber-100 text-amber-700";

        return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${colors}`}>{status}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Appointments</h1>
                <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Search patient or doctor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500">
                        <tr>
                            <th className="p-4 font-semibold">Patient</th>
                            <th className="p-4 font-semibold">Doctor</th>
                            <th className="p-4 font-semibold">Date & Time</th>
                            <th className="p-4 font-semibold">Type</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredAppointments.length === 0 ? (
                            <tr><td colSpan="6" className="p-8 text-center text-slate-400">No appointments found.</td></tr>
                        ) : filteredAppointments.map((apt) => (
                            <tr key={apt._id} className="hover:bg-slate-50/50">
                                <td className="p-4 font-medium text-slate-900 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center text-xs text-slate-400">
                                        {apt.patientId?.image ? <img src={apt.patientId.image} alt="" className="w-full h-full object-cover" /> : (apt.patientId?.name?.[0] || 'U')}
                                    </div>
                                    {apt.patientId?.name || 'Unknown User'}
                                </td>
                                <td className="p-4 text-slate-600 flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden">
                                        {apt.doctorId?.image && <img src={apt.doctorId.image} alt="" className="w-full h-full object-cover" />}
                                    </div>
                                    {apt.doctorId?.name || 'Unknown Doctor'}
                                </td>
                                <td className="p-4 text-slate-600">
                                    <div className="flex flex-col">
                                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                                        <span className="text-xs text-slate-400">{apt.slotTime}</span>
                                    </div>
                                </td>
                                <td className="p-4 capitalize text-slate-600">{apt.type}</td>
                                <td className="p-4"><StatusBadge status={apt.status} /></td>
                                <td className="p-4 text-right font-medium text-slate-700">₹{apt.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
