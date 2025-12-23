"use client";
import React from 'react';
import { MOCK_DATA } from '@/lib/mockData';

export default function RecentActivity() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 h-full">
            <h3 className="font-bold text-slate-800 mb-4">Recent Activity</h3>

            <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-[7px] before:w-[2px] before:bg-slate-100">
                {MOCK_DATA.recentActivity.map((activity, idx) => (
                    <div key={idx} className="relative pl-6">
                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-50 border-4 border-white ring-1 ring-blue-100"></div>
                        <div>
                            <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{activity.desc}</p>
                            <p className="text-[10px] text-slate-400 mt-1">{activity.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
