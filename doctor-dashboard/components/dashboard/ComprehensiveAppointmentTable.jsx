"use client";
import React, { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Calendar, Clock, MapPin, Video, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import PatientProfileModal from '@/components/dashboard/PatientProfileModal';
import BookAppointmentModal from '@/components/dashboard/BookAppointmentModal';

// Mock Data (can be imported, but keeping self-contained for component portability if needed)
import axios from 'axios';

export default function ComprehensiveAppointmentTable() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showBookModal, setShowBookModal] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const doctorId = localStorage.getItem('doctor_id');
        if (!doctorId) return;
        try {
            const res = await axios.get(`http://localhost:8000/api/appointments/doctor/${doctorId}`);
            setAppointments(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            setAppointments(prev => prev.map(apt => apt._id === id ? { ...apt, status: newStatus } : apt));
            await axios.patch('http://localhost:8000/api/appointments/status', {
                appointmentId: id,
                status: newStatus,
                isCompleted: newStatus === 'completed'
            });
            fetchAppointments();
        } catch (error) {
            console.error("Status update failed", error);
            fetchAppointments();
        }
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            pending: "bg-amber-100 text-amber-700",
            confirmed: "bg-blue-100 text-blue-700",
            in_progress: "bg-purple-100 text-purple-700 animate-pulse",
            completed: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700"
        };
        return <Badge className={cn("capitalize shadow-none border-0 px-2.5 py-0.5", styles[status])}>{status === 'in_progress' ? 'In Progress' : status}</Badge>;
    };

    const filteredAppointments = appointments.filter(apt => {
        const matchesStatus = filter === 'all' || apt.status === filter;
        const pName = apt.patientId?.name || apt.userData?.name || '';
        const problem = apt.problem || '';
        const matchesSearch = pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            problem.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="space-y-4 relative">
            {selectedPatient && (
                <PatientProfileModal
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                    onAddVisit={() => { setSelectedPatient(null); setShowBookModal(true); }} // Basic flow
                    onPrescribe={() => { /* Navigate or open prescribe modal */ }}
                />
            )}
            {showBookModal && (
                <BookAppointmentModal
                    onClose={() => setShowBookModal(false)}
                    onSuccess={fetchAppointments}
                />
            )}

            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 text-sm bg-slate-50/50"
                        placeholder="Search by patient name or problem..."
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    {['all', 'pending', 'confirmed', 'completed'].map(f => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            onClick={() => setFilter(f)}
                            className={cn(
                                "capitalize rounded-xl text-xs h-9",
                                filter === f ? "bg-blue-600 text-white" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            {f}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="rounded-t-2xl p-4 border-b border-slate-50 flex justify-between items-center bg-white">
                    <h3 className="font-bold text-slate-800 text-lg">Detailed Appointments</h3>
                    <Button onClick={() => setShowBookModal(true)} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4">+ New Appointment</Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-500 hidden md:table-header-group">
                            <tr>
                                <th className="p-4 font-semibold">Patient</th>
                                <th className="p-4 font-semibold">Problem</th>
                                <th className="p-4 font-semibold">Date & Time</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">
                                        No appointments found.
                                    </td>
                                </tr>
                            ) : filteredAppointments.map((apt) => {
                                const patient = apt.patientId || apt.userData || { name: 'Unknown' };
                                return (
                                    <tr key={apt._id} className="hover:bg-slate-50/50 transition-colors flex flex-col md:table-row p-4 md:p-0 border-b md:border-b-0 relative">
                                        <td className="p-2 md:p-4">
                                            <div onClick={() => setSelectedPatient(apt.patientId || apt.userData)} className="flex items-center gap-3 cursor-pointer group">
                                                <img src={patient.image || "/assets_frontend/profile_pic.png"} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-100 group-hover:border-blue-200" />
                                                <div>
                                                    <p className="font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">{patient.name}</p>
                                                    <p className="text-xs text-slate-500 block md:hidden">{new Date(apt.date).toLocaleDateString()}, {apt.slotTime}</p>
                                                    <StatusBadge status={apt.status} className="md:hidden mt-1" />
                                                </div>
                                            </div>
                                            {/* Mobile Actions Absolute */}
                                            <div className="absolute right-4 top-4 md:hidden">
                                                {/* Mobile Actions Logic simplified */}
                                                {apt.status === 'pending' && <Button size="sm" className="h-8 text-xs" onClick={() => handleStatusUpdate(apt._id, 'confirmed')}>Accept</Button>}
                                                {apt.status === 'confirmed' && <Button size="sm" className="h-8 text-xs bg-blue-600" onClick={() => handleStatusUpdate(apt._id, 'in_progress')}>Start</Button>}
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-4 text-slate-700 font-medium hidden md:table-cell">{apt.problem}</td>
                                        <td className="p-2 md:p-4 hidden md:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                                                    <Calendar size={13} className="text-blue-500" /> {new Date(apt.date).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Clock size={13} className="text-slate-400" /> {apt.slotTime}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-4 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                {apt.type === 'Clinic' ?
                                                    <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg"><MapPin size={14} /></div> :
                                                    <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><Video size={14} /></div>
                                                }
                                                <span className="text-slate-700 font-medium">{apt.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-2 md:p-4 hidden md:table-cell">
                                            <StatusBadge status={apt.status} />
                                        </td>
                                        <td className="p-2 md:p-4 text-right hidden md:table-cell">
                                            <div className="flex items-center justify-end gap-1">
                                                {apt.status === 'pending' && (
                                                    <>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full" onClick={() => handleStatusUpdate(apt._id, 'confirmed')}>
                                                            <CheckCircle size={16} />
                                                        </Button>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full" onClick={() => handleStatusUpdate(apt._id, 'cancelled')}>
                                                            <XCircle size={16} />
                                                        </Button>
                                                    </>
                                                )}
                                                {apt.status === 'confirmed' && (
                                                    <Button size="sm" className="h-8 text-xs bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleStatusUpdate(apt._id, 'in_progress')}>
                                                        Start
                                                    </Button>
                                                )}
                                                {apt.status === 'in_progress' && (
                                                    <Button size="sm" variant="outline" className="h-8 text-xs border-green-200 text-green-600 hover:bg-green-50" onClick={() => handleStatusUpdate(apt._id, 'completed')}>
                                                        Finish
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
