"use client";
import React from 'react';
import { Menu, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"; // We'll need to create this or use specific Drawer logic
import Sidebar from './Sidebar';

export default function MobileNav() {
    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 sticky top-0 z-40">
            <div className="flex items-center gap-2 text-blue-600">
                <div className="bg-blue-600 text-white p-1 rounded-lg">
                    <Stethoscope size={16} />
                </div>
                <span className="font-bold text-lg text-slate-900">Sehat<span className="text-blue-600">Nxt</span></span>
            </div>

            {/* We will implement a proper Sheet/Drawer later, for now simple toggle placeholder or just the button */}
            <Button variant="ghost" size="icon">
                <Menu size={24} className="text-slate-600" />
            </Button>
        </div>
    );
}
