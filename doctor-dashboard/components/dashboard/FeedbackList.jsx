"use client";
import React from 'react';
import { Star } from 'lucide-react';
import { MOCK_DATA } from '@/lib/mockData';

export default function FeedbackList() {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Ratings & Reviews</h3>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
            </div>

            <div className="p-4 space-y-4">
                {MOCK_DATA.feedbacks.map((feedback) => (
                    <div key={feedback.id} className="flex gap-4 items-start border-b border-slate-50 last:border-0 pb-4 last:pb-0">
                        <img src={feedback.image} alt={feedback.patient} className="w-10 h-10 rounded-full object-cover" />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-slate-800 text-sm">{feedback.patient}</h4>
                                <span className="text-[10px] text-slate-400">{feedback.time}</span>
                            </div>
                            <div className="flex items-center gap-0.5 my-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} className={i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                                ))}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{feedback.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
