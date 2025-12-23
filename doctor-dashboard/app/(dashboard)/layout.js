"use client";
import DashboardShell from '@/components/layout/DashboardShell';

export default function DoctorLayout({ children }) {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
