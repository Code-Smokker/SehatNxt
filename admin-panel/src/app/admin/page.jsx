"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import StatsCard from '@/components/admin/StatsCard';
import { Stethoscope, Users, Calendar, Activity, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        doctorsTotal: 0,
        doctorsActive: 0,
        usersTotal: 0,
        usersNew: 0,
        appointmentsTotal: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('/api/admin/stats');
                setStats(res.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Loading stats...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Doctors"
                    value={stats.doctorsTotal}
                    icon={Stethoscope}
                    color="bg-blue-500"
                    subText={`${stats.doctorsActive} Active`}
                />
                <StatsCard
                    title="Total Users"
                    value={stats.usersTotal}
                    icon={Users}
                    color="bg-indigo-500"
                    subText={`${stats.usersNew} New Today`}
                />
                <StatsCard
                    title="Appointments"
                    value={stats.appointmentsTotal}
                    icon={Calendar}
                    color="bg-emerald-500"
                    subText="All time"
                />
                <StatsCard
                    title="System Health"
                    value="100%"
                    icon={Activity}
                    color="bg-rose-500"
                    subText="Operational"
                />
            </div>
        </div>
    );
}
