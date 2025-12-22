"use client";

import React, { useState, useEffect } from 'react';
import { Coins, Copy, Users, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';

const WalletPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWallet();
    }, []);

    const fetchWallet = async () => {
        try {
            // Assuming localStorage has user object with _id, or we pass it via query in this simplified version
            // In production, we'd use a real auth context. 
            // I'll assume we can get the ID securely.
            // For now, I'll allow fetching "my" referrals if I pass userId explicitly or use a mock ID for dev if auth is missing
            const user = JSON.parse(localStorage.getItem('sehat_user'));
            const userId = user?.id || '675d691f6920fbb247656920'; // Fallback to a known ID for testing if localstorage empty

            const res = await axios.get(`http://localhost:8000/api/referrals/my?userId=${userId}`);
            setData(res.data);
        } catch (err) {
            console.error("Wallet Load Error", err);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = () => {
        if (!data) return;
        navigator.clipboard.writeText(data.referralCode);
        alert("Referral Code Copied!");
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading Wallet...</div>;

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">My Wallet</h1>

            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-indigo-100 font-medium mb-1 uppercase tracking-wide text-xs">Available Balance</p>
                    <h2 className="text-5xl font-black flex items-center gap-2">
                        <Coins size={40} className="text-yellow-400" />
                        {data?.wallet?.sehatCoins || 0}
                    </h2>
                    <p className="mt-2 text-sm text-indigo-100 opacity-80">1 Coin = ₹1 (Redeemable on appointments)</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full md:w-auto min-w-[280px]">
                    <p className="text-xs font-bold uppercase text-indigo-100 mb-2">Your Referral Code</p>
                    <div className="flex items-center gap-2 bg-white/20 p-3 rounded-xl">
                        <code className="flex-1 font-mono text-xl font-bold tracking-widest text-center">{data?.referralCode}</code>
                        <button onClick={copyCode} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <Copy size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Referrals */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-slate-400" /> Referral History
                </h3>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    {(!data?.referrals || data.referrals.length === 0) ? (
                        <div className="p-8 text-center text-slate-400">
                            <p>No referrals yet. Invite friends to earn coins!</p>
                        </div>
                    ) : (
                        <div>
                            {data.referrals.map((ref) => (
                                <div key={ref._id} className="p-4 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                            {ref.refereeId?.name?.[0] || "?"}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-800">{ref.refereeId?.name || "New User"}</p>
                                            <p className="text-xs text-slate-400">{new Date(ref.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div>
                                        {ref.status === 'approved' && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                                <CheckCircle size={12} /> +{ref.rewardCoins} Coins
                                            </span>
                                        )}
                                        {ref.status === 'pending' && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-full">
                                                <Clock size={12} /> Pending
                                            </span>
                                        )}
                                        {ref.status === 'rejected' && (
                                            <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                                                <Clock size={12} /> Rejected
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WalletPage;
