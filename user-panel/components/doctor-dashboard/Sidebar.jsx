"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Calendar,
    Users,
    Clock,
    BarChart3,
    Settings,
    X,
    Stethoscope,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming this exists, otherwise will implement simple join
import { Button } from "@/components/ui/button"; // Assuming standard UI components exist or will stub
// If Button/cn don't exist in specific paths, I'll adapt. 
// Checking user's project structure, utils usually in lib/utils.

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/doctor/dashboard" },
    { label: "Appointments", icon: Calendar, path: "/doctor/appointments" },
    { label: "Patients", icon: Users, path: "/doctor/patients" },
    { label: "Schedule", icon: Clock, path: "/doctor/schedule" },
    { label: "Analytics", icon: BarChart3, path: "/doctor/analytics" },
    { label: "Settings", icon: Settings, path: "/doctor/settings" },
];

export function Sidebar({ isOpen, onClose }) {
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                <Link href="/doctor/dashboard" className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-slate-800">SehatNxt Doc</span>
                </Link>
                <button
                    className="lg:hidden p-2 text-slate-500 hover:text-slate-800"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer actions */}
            <div className="p-4 border-t border-slate-100">
                <Link href="/home" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium">
                    <LogOut className="w-5 h-5" />
                    Back to User App
                </Link>
            </div>
        </aside>
    );
}
