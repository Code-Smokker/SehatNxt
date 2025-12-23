"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Star,
    MessageSquare,
    Wallet,
    Share2,
    Download,
    Settings,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
        { name: 'Patients', href: '/dashboard/patients', icon: Users },
        { name: 'Prescriptions', href: '/dashboard/prescriptions', icon: FileText },
        { name: 'Reputation', href: '/dashboard/reputation', icon: Star },
        { name: 'Communication', href: '/dashboard/communication', icon: MessageSquare },
        { name: 'Earnings', href: '/dashboard/earnings', icon: Wallet },
        { name: 'Refer & Earn', href: '/dashboard/refer', icon: Share2 },
        { name: 'Data Export', href: '/dashboard/export', icon: Download },
        { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ];

    return (
        <aside className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6">
                <div className="flex items-center gap-2 text-blue-600">
                    <div className="bg-blue-600 text-white p-1 rounded-lg">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold leading-none">Sehat<span className="text-emerald-500">Nxt+</span></h1>
                        <p className="text-[10px] text-slate-400 font-medium">Clinic Management Platform</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${isActive
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                        >
                            <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all font-medium text-sm">
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
