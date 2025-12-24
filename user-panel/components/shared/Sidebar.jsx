"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { X, ChevronRight, User, LogOut, Calendar, FileText, Pill, Coins, Shield } from "lucide-react";
// import { logout } from "@/actions/auth";
import { useUser, useClerk } from "@clerk/nextjs";

const Sidebar = ({ isOpen, onClose }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut } = useClerk();
    const { user, isSignedIn } = useUser();

    // Mapping Clerk user to component state structure for compatibility if needed, 
    // or direct usage. Let's use direct usage for simplicity.
    const userName = user?.fullName || user?.firstName || 'Guest';
    // Completion logic is proprietary, defaulting to 15% for now or handling properly via metadata later.
    const completion = 15;

    const menuItems = [
        { label: "My Appointments", href: "/appointments", icon: Calendar },
        { label: "Medical Records", href: "/medical-records", icon: FileText },
        { label: "Reminders", href: "/reminders", icon: Pill },
        { label: "Payments", href: "/payments", icon: Coins },
        { label: "Insurance", href: "/insurance", icon: Shield },
    ];

    const handleNavigation = (label, href) => {
        onClose();
        router.push(href);
    };

    const handleLogout = async () => {
        onClose();
        await signOut({ redirectUrl: '/' });
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                onClick={onClose}
            />

            {/* Sidebar Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-[80%] max-w-[300px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-out ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                <div className="h-full overflow-y-auto pb-6 flex flex-col bg-white">

                    {/* --- Header: Logo & Close --- */}
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        <div className="relative w-28 h-8">
                            <Image
                                src="/Sehatnxtlogo.png"
                                alt="SehatNxt"
                                fill
                                sizes="112px"
                                className="object-contain object-left"
                            />
                        </div>
                        <button onClick={onClose} className="p-1.5 bg-slate-50 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* --- Profile Section --- */}
                    <div className="px-6 pb-4">
                        <div
                            className="flex items-start gap-3 mt-4 w-full cursor-pointer group"
                            onClick={() => { onClose(); router.push('/profile'); }}
                        >
                            <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 group-hover:border-blue-200 transition-colors">
                                <User size={28} />
                            </div>
                            <div className="flex-1 mt-0.5 min-w-0">
                                <h3 className="text-lg font-bold text-slate-900 leading-tight truncate">
                                    {userName}
                                </h3>
                                {!isSignedIn ? (
                                    <p className="text-blue-600 text-xs font-semibold mt-0.5">
                                        Login / Signup
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-blue-600 text-[10px] font-bold mt-0.5 truncate">
                                            View and Edit Profile
                                        </p>
                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <div className="h-1 flex-1 bg-slate-100 rounded-full overflow-hidden max-w-[80px]">
                                                <div
                                                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                                                    style={{ width: `${completion}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[9px] font-bold text-green-600">{completion}%</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            {isSignedIn && <ChevronRight size={16} className="text-slate-300 mt-2 group-hover:text-blue-500 transition-colors" />}
                        </div>
                    </div>

                    <div className="w-full h-px bg-slate-100 mb-2"></div>

                    {/* --- Menu Items (Small & Clean) --- */}
                    <div className="py-2 flex-1">
                        {menuItems.map((item, index) => {
                            const isStringIcon = typeof item.icon === 'string';
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(item.label, item.href)}
                                    className="w-full flex items-center gap-4 px-6 py-3.5 hover:bg-slate-50 transition-colors group"
                                >
                                    <div className="w-5 h-5 relative shrink-0 opacity-70 group-hover:opacity-100 transition-all flex items-center justify-center">
                                        {isStringIcon ? (
                                            <Image
                                                src={item.icon}
                                                alt={item.label}
                                                fill
                                                sizes="20px"
                                                className="object-contain"
                                            />
                                        ) : (
                                            <item.icon size={20} className="text-slate-500 group-hover:text-blue-600" />
                                        )}
                                    </div>
                                    <span className="text-slate-600 font-semibold text-[13px] group-hover:text-blue-700 text-left flex-1 tracking-wide">
                                        {item.label}
                                    </span>
                                    <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-300" />
                                </button>
                            );
                        })}
                    </div>

                    {/* --- Logout (Bottom) --- */}
                    {isSignedIn && (
                        <div className="px-6 pb-8 pt-4 border-t border-slate-50">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2.5 text-slate-400 font-semibold text-[13px] hover:text-red-600 transition-colors w-full"
                            >
                                <LogOut size={16} />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default Sidebar;
