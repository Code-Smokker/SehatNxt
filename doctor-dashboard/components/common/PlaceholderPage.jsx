"use client";
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export default function PlaceholderPage({ title }) {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
            <Card>
                <CardContent className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="bg-slate-50 p-6 rounded-full">
                        <span className="text-4xl">🚧</span>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Under Construction</h3>
                        <p className="text-slate-500">This page is coming soon.</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
