"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Heart, Activity, Sun, Moon, Coffee } from 'lucide-react';

const HealthArticlesPage = () => {
    const router = useRouter();

    const articles = [
        {
            id: 1,
            title: "10 Tips for Better Sleep",
            category: "Lifestyle",
            icon: Moon,
            color: "text-indigo-500",
            bg: "bg-indigo-100",
            readTime: "5 min read"
        },
        {
            id: 2,
            title: "Benefits of Morning Walks",
            category: "Fitness",
            icon: Sun,
            color: "text-orange-500",
            bg: "bg-orange-100",
            readTime: "3 min read"
        },
        {
            id: 3,
            title: "Understanding Heart Health",
            category: "Medical",
            icon: Heart,
            color: "text-red-500",
            bg: "bg-red-100",
            readTime: "7 min read"
        },
        {
            id: 4,
            title: "Healthy Hydration Habits",
            category: "Nutrition",
            icon: Coffee,
            color: "text-blue-500",
            bg: "bg-blue-100",
            readTime: "4 min read"
        },
        {
            id: 5,
            title: "Stress Management Techniques",
            category: "Mental Health",
            icon: Activity,
            color: "text-green-500",
            bg: "bg-green-100",
            readTime: "6 min read"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* Header */}
            <div className="bg-white sticky top-0 z-10 px-4 py-4 shadow-sm flex items-center gap-4">
                <button
                    onClick={() => router.push('/home')}
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Health Articles</h1>
            </div>

            {/* List */}
            <div className="p-4 grid gap-4">
                {articles.map(article => (
                    <div key={article.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition">
                        <div className={`w-14 h-14 rounded-2xl ${article.bg} flex items-center justify-center ${article.color}`}>
                            <article.icon size={24} />
                        </div>
                        <div className="flex-1">
                            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block mb-1">{article.category}</span>
                            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{article.title}</h3>
                            <p className="text-xs text-slate-500 font-medium">{article.readTime}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HealthArticlesPage;
