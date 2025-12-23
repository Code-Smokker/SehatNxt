"use client";
import Sidebar from '@/components/admin/Sidebar';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
    const [isDesktop, setIsDesktop] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/login');
            return;
        }
        setIsAuthenticated(true);

        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1024);
        };

        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, [router]);

    if (!isAuthenticated) return null;

    if (!isDesktop) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center">
                <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Desktop Only</h2>
                    <p className="text-slate-500">
                        Top administrative power requires a bigger screen.
                        Please access the Admin Panel from a desktop or laptop.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
