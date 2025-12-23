import React from 'react';
import { Calendar, Users, Clock, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICON_MAP = {
    Calendar,
    Users,
    Clock,
    Wallet
};

export default function StatCard({ title, value, trend, isPositive, icon }) {
    const Icon = ICON_MAP[icon] || Calendar;

    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full min-h-[140px]">
            <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-50/50 rounded-xl text-blue-600">
                    <Icon size={24} />
                </div>
                <span className={cn(
                    "text-xs font-bold px-2 py-1 rounded-full",
                    isPositive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                )}>
                    {trend}
                </span>
            </div>

            <div className="mt-4">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
            </div>
        </div>
    );
}
