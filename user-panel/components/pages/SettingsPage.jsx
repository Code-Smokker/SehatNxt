"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Bell, Shield, MessageCircle, LogOut, ChevronRight, HelpCircle } from 'lucide-react';
// import { logout } from '@/actions/auth';
import { useClerk } from '@clerk/nextjs';

const SettingsPage = () => {
    const router = useRouter();
    const { signOut } = useClerk();

    const handleLogout = async () => {
        await signOut({ redirectUrl: '/' });
    };

    const SettingItem = ({ icon: Icon, label, onClick, color = "text-slate-600", bg = "bg-slate-100" }) => (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 bg-white hover:bg-slate-50 border-b border-slate-50 last:border-none transition-colors"
        >
            <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center ${color}`}>
                <Icon size={20} />
            </div>
            <span className="flex-1 text-left font-bold text-slate-700">{label}</span>
            <ChevronRight size={18} className="text-slate-400" />
        </button>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-4 py-4 shadow-sm flex items-center gap-4">
                <button
                    onClick={() => router.push('/home')}
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Settings</h1>
            </div>

            <div className="p-4 space-y-6">

                {/* Account Section */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Account</h2>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        <SettingItem
                            icon={User}
                            label="Edit Profile"
                            bg="bg-blue-100"
                            color="text-blue-600"
                            onClick={() => router.push('/profile')}
                        />
                        <SettingItem
                            icon={Bell}
                            label="Notifications"
                            bg="bg-purple-100"
                            color="text-purple-600"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon={Shield}
                            label="Privacy & Security"
                            bg="bg-green-100"
                            color="text-green-600"
                            onClick={() => { }}
                        />
                    </div>
                </div>

                {/* Support Section */}
                <div>
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">Support</h2>
                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100">
                        <SettingItem
                            icon={HelpCircle}
                            label="Help & FAQs"
                            bg="bg-amber-100"
                            color="text-amber-600"
                            onClick={() => { }}
                        />
                        <SettingItem
                            icon={MessageCircle}
                            label="Contact Us"
                            bg="bg-pink-100"
                            color="text-pink-600"
                            onClick={() => { }}
                        />
                    </div>
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
                >
                    <LogOut size={20} />
                    Logout
                </button>

                <p className="text-center text-xs text-slate-400 pt-4">Version 1.0.0 • SehatNxt</p>
            </div>
        </div>
    );
};

export default SettingsPage;
