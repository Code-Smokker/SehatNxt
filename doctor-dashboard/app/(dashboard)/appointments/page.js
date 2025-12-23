"use client";
import React, { useState } from 'react';
import { Filter, Check, X, ChevronDown, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// MOCK DATA
const INITIAL_APPOINTMENTS = [
    { id: 1, token: "01", name: "Rajesh Kumar", time: "09:00 AM", status: "Scheduled", contact: "+91 98765 43210", reason: "Regular checkup", date: "2025-12-22" },
    { id: 2, token: "02", name: "Priya Sharma", time: "09:30 AM", status: "Scheduled", contact: "+91 98765 43211", reason: "Fever & cold", date: "2025-12-22" },
    { id: 3, token: "03", name: "Amit Patel", time: "10:00 AM", status: "Scheduled", contact: "+91 98765 43212", reason: "Follow-up", date: "2025-12-22" },
    { id: 4, token: "04", name: "Sneha Verma", time: "10:30 AM", status: "Cancelled", contact: "+91 98765 43213", reason: "Skin consultation", date: "2025-12-22" },
    { id: 5, token: "05", name: "Vikram Singh", time: "11:00 AM", status: "Cancelled", contact: "+91 98765 43214", reason: "General checkup", date: "2025-12-22" },
    { id: 6, token: "06", name: "Anjali Reddy", time: "11:30 AM", status: "Pending", contact: "+91 98765 43215", reason: "Diabetes checkup", date: "2025-12-22" },
];

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
    const [statusFilter, setStatusFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('2025-12-22');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Add Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        name: '',
        time: '',
        contact: '',
        reason: ''
    });

    // Helper functions
    const handleStatusUpdate = (id, newStatus) => {
        setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
    };

    const handleAddAppointment = (e) => {
        e.preventDefault();
        const nextToken = (appointments.length + 1).toString().padStart(2, '0');

        // Format time to 12-hour format if needed, simplistic for now
        // Assuming input type="time" gives 24h string like "14:30"
        let formattedTime = newAppointment.time;
        if (formattedTime) {
            const [h, m] = formattedTime.split(':');
            const hour = parseInt(h);
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const hour12 = hour % 12 || 12;
            formattedTime = `${hour12}:${m} ${ampm}`;
        }

        const newApt = {
            id: appointments.length + 1,
            token: nextToken,
            name: newAppointment.name,
            time: formattedTime || '--:--',
            status: "Pending", // Default new appointments to Pending
            contact: newAppointment.contact || '--',
            reason: newAppointment.reason || '--',
            date: dateFilter // Schedule for the currently selected date
        };

        setAppointments([...appointments, newApt]);
        setIsAddModalOpen(false);
        setNewAppointment({ name: '', time: '', contact: '', reason: '' });
    };

    // Derived State
    const filteredAppointments = appointments.filter(apt => {
        const matchesStatus = statusFilter === 'All' || apt.status === statusFilter;
        const matchesDate = apt.date === dateFilter;
        return matchesStatus && matchesDate;
    });

    const nextTokenDisplay = (appointments.length + 1).toString().padStart(2, '0');

    // UI Components
    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: "bg-amber-100 text-amber-700 border-none px-3 py-1",
            Scheduled: "bg-green-100 text-green-700 border-none px-3 py-1",
            Cancelled: "bg-red-100 text-red-700 border-none px-3 py-1"
        };
        return <Badge className={cn("text-xs font-medium rounded-full shadow-none hover:bg-opacity-80", styles[status])}>{status}</Badge>;
    };

    const ActionButtons = ({ id }) => (
        <div className="flex gap-2 justify-end">
            <button
                onClick={() => handleStatusUpdate(id, 'Scheduled')}
                className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center hover:bg-green-100 transition-colors"
                title="Mark as Scheduled"
            >
                <Check size={16} strokeWidth={3} />
            </button>
            <button
                onClick={() => handleStatusUpdate(id, 'Cancelled')}
                className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Cancel Appointment"
            >
                <X size={16} strokeWidth={3} />
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Appointments</h1>
                    <p className="text-slate-500 text-sm">Manage your patient appointments</p>
                </div>
                <Button
                    className="bg-[#00BFA5] hover:bg-[#00A693] text-white font-medium px-6"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    + Add Appointment
                </Button>
            </div>

            {/* Filter Bar */}
            <Card className="rounded-xl border-none shadow-sm">
                <div className="p-3 flex items-center gap-4">
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors"
                        >
                            <Filter size={16} />
                            <span>{statusFilter === 'All' ? 'All Appointments' : statusFilter}</span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-20">
                                    {['All', 'Scheduled', 'Pending', 'Cancelled'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setStatusFilter(status);
                                                setIsFilterOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-blue-600 font-medium"
                                        >
                                            {status === 'All' ? 'All Appointments' : status}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="relative flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-slate-600 text-sm font-medium hover:bg-slate-100 transition-colors">
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                        />
                        <span className="z-0 pointer-events-none">{dateFilter.split('-').reverse().join('/')}</span>
                        <CalendarIcon size={16} className="ml-2 opacity-50 z-0 pointer-events-none" />
                    </div>
                </div>
            </Card>

            {/* Table */}
            <Card className="rounded-xl border-none shadow-sm overflow-hidden min-h-[400px]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                            <tr>
                                <th className="p-5 w-24">Token No.</th>
                                <th className="p-5">Patient Name</th>
                                <th className="p-5">Time</th>
                                <th className="p-5">Status</th>
                                <th className="p-5">Contact</th>
                                <th className="p-5">Reason</th>
                                <th className="p-5 text-right w-32">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((apt) => (
                                    <tr key={apt.id} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="p-5">
                                            <div className="w-10 h-10 rounded-lg bg-[#00BFA5] text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-teal-100">
                                                {apt.token}
                                            </div>
                                        </td>
                                        <td className="p-5 font-semibold text-slate-700">{apt.name}</td>
                                        <td className="p-5 text-slate-600 font-medium">{apt.time}</td>
                                        <td className="p-5">
                                            <StatusBadge status={apt.status} />
                                        </td>
                                        <td className="p-5 text-slate-600 font-medium">{apt.contact}</td>
                                        <td className="p-5 text-slate-600">{apt.reason}</td>
                                        <td className="p-5">
                                            {apt.status === 'Pending' ? (
                                                <ActionButtons id={apt.id} />
                                            ) : (
                                                <div className="h-8"></div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">
                                        No appointments found for this date.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* ADD APPOINTMENT MODAL */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-md p-6 rounded-2xl gap-6">
                    <DialogHeader className="space-y-1 text-left">
                        <DialogTitle className="text-xl font-bold text-slate-900">Add New Appointment</DialogTitle>
                        <DialogDescription className="text-slate-500 text-sm">
                            Create a new appointment for a walk-in patient <br />
                            <span className="flex items-center gap-1 mt-1 bg-slate-100 w-fit px-2 py-0.5 rounded text-xs font-medium text-slate-600">
                                <CalendarIcon size={12} /> {dateFilter.split('-').reverse().join('/')}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Token Display */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1 relative overflow-hidden">
                        <span className="text-sm font-medium text-slate-500 z-10">Next Token Number</span>
                        <div className="w-14 h-14 rounded-xl bg-[#00BFA5] text-white flex items-center justify-center font-bold text-2xl shadow-sm shadow-teal-100 z-10">
                            {nextTokenDisplay}
                        </div>
                        {/* Decorative background element mimicking the blue gradient in image slightly */}
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-blue-50 to-transparent opacity-50 z-0"></div>
                    </div>

                    <form onSubmit={handleAddAppointment} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Patient Name *</label>
                            <Input
                                placeholder="Enter patient name"
                                required
                                value={newAppointment.name}
                                onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
                                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Appointment Time *</label>
                            <div className="relative">
                                <Input
                                    type="time"
                                    required
                                    value={newAppointment.time}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                    className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 transition-all font-medium pl-10"
                                />
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Contact Number <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span></label>
                            <Input
                                placeholder="+91 xxxxx xxxxx"
                                type="tel"
                                value={newAppointment.contact}
                                onChange={(e) => setNewAppointment({ ...newAppointment, contact: e.target.value })}
                                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Reason for Visit <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span></label>
                            <Input
                                placeholder="Brief reason"
                                value={newAppointment.reason}
                                onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                                className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 transition-all font-medium"
                            />
                        </div>

                        <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base mt-2">
                            Schedule Appointment
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
