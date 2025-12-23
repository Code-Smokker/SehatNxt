"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Search, User, ChevronLeft, Shield } from "lucide-react";
import Sidebar from "./Sidebar";
import LocationModal from "../location/LocationModal";
import GlobalSearch from "./GlobalSearch";
import { useLocation } from "../../context/LocationContext";
import { getMyPrescriptions } from '@/actions/prescription';

// ... other imports

const Navbar = ({ tokenData }) => {
    const pathname = usePathname();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Use Global Location Context
    const {
        selectedLocation,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal
    } = useLocation();
    React.useEffect(() => {
        let lastCount = localStorage.getItem('rx_count');

        const checkUpdates = async () => {
            // 1. Check Prescriptions
            if (pathname !== '/medical-records') {
                try {
                    const rxs = await getMyPrescriptions();
                    const currentCount = rxs ? rxs.length : 0;
                    if (lastCount !== null && currentCount > parseInt(lastCount)) {
                        router.push('/medical-records');
                    }
                    localStorage.setItem('rx_count', currentCount);
                    lastCount = currentCount;
                } catch (e) { console.error("Rx Poll Error", e); }
            }

            // 2. Check Reminders (New)
            try {
                // Poll backend for recently sent reminders
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';
                const token = localStorage.getItem('token');
                // Note: tokenData prop might be stale or not token itself. Using localStorage 'token' if available
                // or tokenData if it contains the token string. 
                // Assuming standard Auth flow has token in localStorage or cookie.
                // The axios call will use withCredentials, but 'protect' middleware expects Authorization header usually.
                // Let's check how 'protect' works.
                // If protect reads from cookies, we are good. If header, need token.
                // Assuming cookie-based due to `withCredentials: true` fix earlier.

                // Correction: The user is using axios withCredentials.
                if (!token) return;

                const res = await axios.get(`${baseUrl}/reminders/due`, {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.data.success && res.data.reminders.length > 0) {
                    // Check if we already notified for these
                    const notifiedIds = JSON.parse(localStorage.getItem('notified_reminders') || '[]');

                    res.data.reminders.forEach(rem => {
                        if (!notifiedIds.includes(rem._id)) {
                            // TRIGGER NOTIFICATION
                            if (Notification.permission === 'granted') {
                                new Notification(`Time for Medicine: ${rem.title}`, {
                                    body: `Scheduled for ${new Date(rem.datetime).toLocaleTimeString()}`,
                                    icon: '/icons/pill.png' // Optional
                                });
                            } else {
                                // Fallback alert/toast
                                alert(`🔔 Reminder: ${rem.title}`);
                            }
                            notifiedIds.push(rem._id);
                        }
                    });

                    localStorage.setItem('notified_reminders', JSON.stringify(notifiedIds));
                }
            } catch (e) {
                // Silent fail for polling
            }
        };

        // Request Notification Permission on mount
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        const interval = setInterval(checkUpdates, 10000); // Check every 10s
        checkUpdates();

        return () => clearInterval(interval);
    }, [pathname, router]);

    // 1. Appointments Page Custom Top Bar
    if (pathname === '/appointments') {
        return (
            <div className="sticky top-0 z-50 w-full 
                bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400
                text-white rounded-b-3xl 
                pb-6 pt-5 px-5 
                shadow-xl shadow-blue-800/20"
            >
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push('/home')}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-active scale-95"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-lg font-bold">My Appointments</h1>
                        <p className="text-xs text-blue-100 font-medium">Manage your bookings</p>
                    </div>
                    <div className="w-10"></div>
                </div>
            </div>
        );
    }

    // 2. Medical Records Custom Top Bar
    if (pathname === '/medical-records') {
        return (
            <div className="sticky top-0 z-50 w-full 
                bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400
                text-white rounded-b-3xl 
                pb-6 pt-5 px-5 
                shadow-xl shadow-blue-800/20"
            >
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push('/home')}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-active scale-95"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>

                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-tight">Medical Records</h1>
                        <p className="text-blue-100 text-xs font-medium opacity-90">Doctor-prescribed history</p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                        <Shield size={12} className="text-white fill-white/20" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wide">Secure</span>
                    </div>
                </div>
            </div>
        );
    }

    // 3. My Doctors Custom Top Bar (New)
    if (pathname === '/doctors') {
        return (
            <div className="sticky top-0 z-50 w-full 
                bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400
                text-white rounded-b-3xl 
                pb-6 pt-5 px-5 
                shadow-xl shadow-blue-800/20"
            >
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push('/home')}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-active scale-95"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>

                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-tight">My Doctors</h1>
                        <p className="text-blue-100 text-xs font-medium opacity-90">Doctors you have booked</p>
                    </div>

                    <div className="w-10"></div> {/* Spacer for center alignment */}
                </div>
            </div>
        );
    }

    // 4. Reminders Custom Top Bar (New)
    if (pathname === '/reminders') {
        return (
            <div className="sticky top-0 z-50 w-full 
                bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400
                text-white rounded-b-3xl 
                pb-6 pt-5 px-5 
                shadow-xl shadow-blue-800/20"
            >
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.push('/home')}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-active scale-95"
                    >
                        <ChevronLeft size={20} className="text-white" />
                    </button>

                    <div className="text-center">
                        <h1 className="text-xl font-bold tracking-tight">Reminders</h1>
                        <p className="text-blue-100 text-xs font-medium opacity-90">Never miss a dose</p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-sm">
                        <Shield size={12} className="text-white fill-white/20" />
                        <span className="text-[10px] font-bold text-white uppercase tracking-wide">Secure</span>
                    </div>
                </div>
            </div>
        );
    }

    // Default Logic for Home/Location Header
    const displayAddress = selectedLocation
        ? (selectedLocation.label && selectedLocation.label !== "Selected Location"
            ? selectedLocation.label
            : selectedLocation.displayName || selectedLocation.fullAddress.split(',')[0])
        : "Select Location";

    const badgeCount = tokenData?.patientsAhead;
    const isUrgent = badgeCount < 3;

    return (
        <>
            <div className="sticky top-0 w-full bg-gradient-to-b from-blue-700 via-blue-500 to-blue-400 text-white rounded-b-3xl pb-6 pt-5 px-5 shadow-xl shadow-blue-800/20 relative z-50">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:bg-white/30 transition-all duration-300 flex items-center justify-center border border-white/20"
                        >
                            <User size={22} className="text-white drop-shadow-md" strokeWidth={2.5} />
                        </button>

                        <div
                            onClick={openLocationModal}
                            className="flex flex-col cursor-pointer group"
                        >
                            <span className="text-[11px] text-blue-100 font-medium tracking-wide uppercase group-hover:text-white transition-colors flex items-center gap-1">
                                Location

                            </span>
                            <span className="text-sm font-bold flex items-center gap-1 text-white max-w-[180px] truncate leading-tight">
                                {displayAddress}
                                <ChevronDown size={14} className="opacity-80 group-hover:translate-y-0.5 transition-transform" />
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/notifications')}
                        className="w-10 h-10 rounded-full bg-white shadow-lg shadow-blue-900/10 hover:bg-blue-50 transition-all flex items-center justify-center group relative"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="#2563eb" viewBox="0 0 16 16" className="group-hover:scale-110 transition-transform">
                            <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2" />
                            <path d="M8 1.918l-.797.161A4 4 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4 4 0 0 0-3.203-3.92z" />
                        </svg>
                        {badgeCount !== undefined && badgeCount > 0 && (
                            <div className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white shadow-sm ${isUrgent ? 'bg-orange-500 animate-pulse' : 'bg-red-500'}`}>
                                {badgeCount}
                            </div>
                        )}
                    </button>
                </div>

                <GlobalSearch />
            </div>

            {isLocationModalOpen && (
                <LocationModal
                    isOpen={isLocationModalOpen}
                    onClose={closeLocationModal}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

export default Navbar;
