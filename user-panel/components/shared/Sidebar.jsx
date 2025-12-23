"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, ChevronRight, User, LogOut, Calendar, FileText, Pill, Coins, Shield } from "lucide-react";
import { logout } from "@/actions/auth";

const Sidebar = ({ isOpen, onClose }) => {
    const router = useRouter();
    const [user, setUser] = useState({ name: 'Guest', phone: '', isGuest: true, completion: 0 });

    useEffect(() => {
        const loadUser = () => {
            const userData = localStorage.getItem('sehat_user');
            if (userData) {
                try {
                    const parsed = JSON.parse(userData);
                    setUser({
                        name: parsed.name || 'Sehat User',
                        phone: parsed.phone || '',
                        isGuest: false,
                        completion: parsed.completion || 15 // Default 15% for basic details
                    });
                } catch (e) {
                    console.error("Error parsing user data", e);
                    setUser({ name: 'Guest', phone: '', isGuest: true, completion: 0 });
                }
            } else {
                setUser({ name: 'Guest', phone: '', isGuest: true, completion: 0 });
            }
        };

        // Initial Load
        loadUser();

        // Listen for updates (from Profile Save)
        window.addEventListener('storage', loadUser);
        return () => window.removeEventListener('storage', loadUser);
    }, []);

    const menuItems = [
        { icon: Calendar, label: "Appointments", href: "/appointments" },
        { icon: FileText, label: "Medical Records", href: "/medical-records" },
        { icon: "/labtestside.png", label: "Test Bookings", href: "/test-bookings" },
        { icon: "/Medicine copy.png", label: "Orders", href: "/orders" },
        { icon: "/MY Doc.png", label: "My Doctors", href: "/doctors" },
        { icon: "/REminder.png", label: "Reminders", href: "/reminders" },
        { icon: "/Payments.png", label: "Payments & Health cash", href: "/payments" },
        { icon: "/Support.png", label: "Help Center", href: "/help-center" },
    ];

    const handleNavigation = (label, href) => {
        onClose();
        if (href) {
            router.push(href);
            return;
        }
        // Fallback for items without explicit href in old logic
        switch (label) {
            case "Appointments": router.push('/appointments'); break;
            case "My Doctors": router.push('/doctors'); break;
            case "Medical records": router.push('/medical-records'); break;
            case "Reminders": router.push('/reminders'); break;
            case "Read Health Articles": router.push('/articles'); break;
            case "Settings": router.push('/settings'); break;
            default: break;
        }
    };

    const handleLogout = async () => {
        onClose();
        await logout();
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
                                    {user.name}
                                </h3>
                                {user.isGuest ? (
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
                                                    style={{ width: `${user.completion}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[9px] font-bold text-green-600">{user.completion}%</span>
                                        </div>
                                    </>
                                )}
                            </div>
                            {!user.isGuest && <ChevronRight size={16} className="text-slate-300 mt-2 group-hover:text-blue-500 transition-colors" />}
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
                    {!user.isGuest && (
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
