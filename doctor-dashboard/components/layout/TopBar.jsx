"use client";
import Link from 'next/link';
import { Bell, Search } from 'lucide-react';

export default function TopBar() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            {/* Search (Desktop Only) */}
            <div className="hidden md:flex items-center bg-slate-50 px-3 py-2 rounded-xl w-96 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                <Search size={18} className="text-slate-400" />
                <input
                    type="text"
                    placeholder="Search patients, appointments..."
                    className="bg-transparent border-none outline-none text-sm ml-2 w-full placeholder:text-slate-400 text-slate-700"
                />
            </div>

            {/* Mobile Title (If needed, else hidden) */}
            <div className="md:hidden font-bold text-lg text-slate-800">
                Sehat<span className="text-blue-600">Nxt</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                <button className="relative p-2 rounded-full hover:bg-slate-50 text-slate-500 transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                <Link href="/profile">
                    <div className="h-9 w-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm hover:ring-2 hover:ring-blue-100 transition-all cursor-pointer">
                        DR
                    </div>
                </Link>
            </div>
        </header>
    );
}
