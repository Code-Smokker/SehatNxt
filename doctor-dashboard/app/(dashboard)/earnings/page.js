"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, TrendingUp, IndianRupee, Users, CreditCard, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Area
} from 'recharts';

export default function EarningsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Monthly'); // Daily, Weekly, Monthly

    useEffect(() => {
        const fetchAnalytics = async () => {
            const doctorId = localStorage.getItem('doctor_id');
            if (!doctorId) return;

            try {
                const res = await axios.get(`http://localhost:8000/api/analytics/doctor/${doctorId}`);
                setData(res.data);
            } catch (error) {
                console.error("Fetch analytics failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="p-8 text-center text-slate-400">Loading analytics...</div>;
    if (!data) return <div className="p-8 text-center">No data available</div>;

    const { summary, graphData, recentTransactions } = data;

    return (
        <div className="space-y-6 pb-24 md:pb-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Earnings & Analytics</h1>
                    <p className="text-slate-500 mt-1">Track your financial performance</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-200">
                    <Download size={18} className="mr-2" /> Export Report
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase">Total Earnings</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">₹{summary.totalRevenue.toLocaleString()}</h2>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                            <TrendingUp size={12} /> +12% from last year
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                        <IndianRupee size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase">This Month</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">₹{summary.monthRevenue.toLocaleString()}</h2>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            {summary.monthPatients} Patients
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <Activity size={24} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                        <p className="text-sm font-bold text-slate-500 uppercase">Avg Fee / Patient</p>
                        <h2 className="text-3xl font-bold text-slate-900 mt-1">₹{summary.avgFee}</h2>
                        <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
                            Stable
                        </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <Users size={24} />
                    </div>
                </div>
            </div>

            {/* Combined Chart */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                    <h3 className="font-bold text-slate-800 text-lg">Revenue Trend</h3>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        {['Weekly', 'Monthly'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={graphData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} dx={-10} tickFormatter={(value) => `₹${value / 1000}k`} />
                            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ fontWeight: 'bold', fontSize: '13px' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px' }} />
                            <Bar yAxisId="left" dataKey="earnings" name="Earnings (₹)" fill="#3b82f6" barSize={30} radius={[4, 4, 0, 0]} />
                            <Line yAxisId="right" type="monotone" dataKey="patients" name="Patients" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="font-bold text-slate-800 text-lg">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">Patient</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Mode</th>
                                <th className="px-6 py-4">Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {recentTransactions.length === 0 ? (
                                <tr><td colSpan="6" className="text-center py-8 text-slate-400">No transactions recorded</td></tr>
                            ) : recentTransactions.map((txn, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm text-slate-600">TXN-{txn._id.slice(-6).toUpperCase()}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{txn.patientId?.name || "Unknown"}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(txn.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">₹{txn.amount}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded text-xs font-bold uppercase">
                                            {/* Mock mode since DB doesn't have it yet explicitly or add logic */}
                                            UPI
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">Consultation Fee</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
