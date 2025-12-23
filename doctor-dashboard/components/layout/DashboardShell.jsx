"use client";
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from '@/components/common/BottomNav';
import MobileDoctorHeader from '@/components/common/MobileDoctorHeader';
import { useMobile } from '@/hooks/useMobile';

export default function DashboardShell({ children }) {
    const isMobile = useMobile();
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row pb-16 md:pb-0">
            {/* Desktop Sidebar (Hidden on Mobile) */}
            <div className="hidden md:block w-72 fixed inset-y-0 z-50 bg-white border-r border-slate-200">
                <Sidebar />
            </div>

            {/* Mobile Bottom Nav (Visible only on Mobile) */}
            <BottomNav />

            {/* Main Content Area */}
            <div className="flex-1 md:pl-72 flex flex-col min-h-screen w-full transition-all duration-300">
                {/* Desktop TopBar */}
                <div className="hidden md:block">
                    <TopBar />
                </div>

                {/* Mobile Header (Blue Curve) */}
                <MobileDoctorHeader />

                <main className="flex-1 md:p-8 max-w-7xl mx-auto w-full space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
