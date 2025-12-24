"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn, removeToken } from '@/lib/utils';
import {
    LayoutDashboard,
    CalendarCheck,
    Users,
    Clock,
    BarChart3,
    Settings,
    LogOut,
    Stethoscope,
    Star,
    FileText,
    Wallet,
    Download // Added Download
} from 'lucide-react';
import { MENU_ITEMS } from '@/lib/constants';

// Icon Map
const IconMap = {
    LayoutDashboard,
    CalendarCheck,
    Users,
    Clock,
    BarChart3,
    Settings,
    Star,
    FileText,
    Wallet,
    Download // Added Download
};

import { useClerk } from '@clerk/nextjs';

export default function Sidebar({ className, onLinkClick }) {
    const pathname = usePathname();
    const { signOut } = useClerk();

    // Use MENU_ITEMS directly to show Appointments
    const filteredMenuItems = MENU_ITEMS;

    const handleLogout = async () => {
        await signOut({ redirectUrl: '/sign-in' });
    };

    return (
        <aside className={cn("flex flex-col h-full bg-white border-r border-slate-100", className)}>
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-50 shrink-0 bg-white">
                <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="SehatNxt" className="h-8 w-auto object-contain" />

                </div>
            </div>

            {/* Menu */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                {filteredMenuItems.map((item) => {
                    const Icon = IconMap[item.icon];
                    const isActive = pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onLinkClick}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <Icon size={18} className={cn("transition-colors", isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-50 shrink-0">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
