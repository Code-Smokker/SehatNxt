"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Plus, Trash2, Calendar, Clock, Loader2, Check, X, Pill } from 'lucide-react';
import { createReminder, getReminders, deleteReminder } from '@/actions/reminder';

const RemindersPage = () => {
    const router = useRouter();
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const loadReminders = async () => {
        try {
            const data = await getReminders();
            setReminders(data);
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadReminders();
    }, []);

    const handleAdd = async () => {
        if (!title.trim() || !date || !time) {
            alert("Please fill in all fields correctly.");
            return;
        }

        setSubmitting(true);
        try {
            const dateTimeString = `${date}T${time}`;
            const scheduledTime = new Date(dateTimeString);

            if (isNaN(scheduledTime.getTime())) {
                throw new Error("Invalid date or time selected.");
            }

            await createReminder({
                title,
                datetime: scheduledTime.toISOString(),
                type: 'pill'
            });
            setTitle("");
            setDate("");
            setTime("");
            setIsAdding(false);
            loadReminders();
        } catch (error) {
            console.error(error);
            alert("Error adding reminder: " + error.message);
        }
        setSubmitting(false);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this reminder?")) return;
        try {
            await deleteReminder(id);
            setReminders(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans relative overflow-hidden">
            {/* Floating Orbs Animation (Background) */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-200/20 rounded-full blur-3xl animate-blob"></div>
                <div className="absolute top-[20%] right-[-10%] w-[250px] h-[250px] bg-purple-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
            </div>

            {/* Header is handled by Navbar.jsx */}

            <div className="p-5 space-y-6 relative z-10">

                {/* Add Button */}
                {!isAdding ? (
                    <div
                        onClick={() => setIsAdding(true)}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer active:scale-98 transition-transform group"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors">
                            <Plus size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Add New Reminder</h3>
                            <p className="text-xs text-slate-500">Medicine, Appointment, etc.</p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl p-5 shadow-lg border border-blue-100 animate-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Plus size={16} />
                                </span>
                                New Reminder
                            </h3>
                            <button onClick={() => setIsAdding(false)} className="bg-slate-50 p-2 rounded-full text-slate-400 hover:text-slate-600">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Title</label>
                                <input
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 font-medium text-slate-700 placeholder:text-slate-400"
                                    placeholder="e.g. Take Vitamin C"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Date</label>
                                    <input
                                        type="date"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm font-medium text-slate-700"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Time</label>
                                    <input
                                        type="time"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 text-sm font-medium text-slate-700"
                                        value={time}
                                        onChange={e => setTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleAdd}
                                disabled={submitting}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                {submitting ? "Saving..." : "Set Reminder"}
                            </button>
                        </div>
                    </div>
                )}

                {/* List Headers */}
                {reminders.length > 0 && <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Your Reminders</h3>}

                {/* List */}
                <div className="space-y-3">
                    {reminders.length === 0 && !isAdding ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-24 h-24 rounded-full bg-blue-50 flex items-center justify-center mb-6 animate-pulse">
                                <Bell size={40} className="text-blue-500 opacity-60" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-800">No reminders set</h2>
                            <p className="text-xs text-slate-500 mt-2 max-w-[200px]">
                                Add reminders for your medicines or appointments to stay on track.
                            </p>
                        </div>
                    ) : (
                        reminders.map(rem => (
                            <div key={rem._id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 relative group overflow-hidden">
                                {/* Decor Item */}
                                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>

                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                                    <Pill size={22} />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-slate-800 text-base truncate pr-2">{rem.title}</h3>
                                    <div className="flex items-center gap-3 mt-1 text-slate-500 text-xs font-medium">
                                        <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-md">
                                            <Calendar size={10} className="text-slate-400" />
                                            {new Date(rem.datetime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
                                            <Clock size={10} />
                                            {new Date(rem.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleDelete(rem._id)}
                                    className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default RemindersPage;
