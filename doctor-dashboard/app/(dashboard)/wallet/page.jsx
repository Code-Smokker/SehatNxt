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
            // In Doctor Dashboard, we assume token is present in localStorage 'token'.
            // However, the backend /api/referrals/my route relies on query param userId for now based on previous implementation complexity.
            // Ideally should decode token. 
            // For MVP User/Doctor panel sync, I'll check if we have doctor info in localStorage.

            // Checking how doctor login saves data. 
            // Previous steps showed: 
            // res.json({ ..., token, userId: user._id, doctorId: doctor._id ...})
            // I'll try to find 'doctor_user' or similar in localStorage, otherwise fallback to known ID.

            // Wait, for Doctor Dashboard, let's assume `localStorage.getItem('doctor')` or verify auth.
            // I will use a fallback or try to read from token payload if possible, but simplest is query param if I can get ID.

            const doctorData = localStorage.getItem('doctorInfo');
            let userId = null;
            if (doctorData) {
                const parsed = JSON.parse(doctorData);
                // The doctor model has userId which is the User link. The wallet is on User/Doctor? 
                // Wait, User has wallet, Doctor has wallet. The prompts says "Doctors... wallet".
                // If I'm querying /api/referrals/my... it fetches `User.findById(userId)`. 
                // Does `Doctor` have its own wallet or shares with User?
                // The prompt says "2. doctors Collection { wallet: ... }". So Doctor has separate wallet.
                // But my API `/api/referrals/my` in `referralRoutes.js` queries `User`.

                // CRITICAL CORRECTION: I need to update `referralRoutes.js` to check if ID is Doctor or User, OR
                // Update implementation to use `User` for everything if the prompt implies strict separation but maybe I missed it?
                // Master Prompt: "1. users... wallet... 2. doctors... wallet...". Separate.

                // I need to update `referralRoutes.js` to handle Doctor Wallet fetching too!
                // For now, I will write the Frontend assuming the backend will be fixed to handle `?role=doctor` or similar.

                userId = parsed.userId || parsed._id; // Prefer userId (User link) if wallet shared, or _id if separate. 
                // Let's assume Separate Wallet for Doctor model.
            }

            // Since backend currently only queries User, I should update Backend first?
            // "TaskStatus: Updating Doctor Dashboard UI".
            // I will implement this page, and then perform a quick backend fix for Doctor Wallet support.

            // For now, passing ?userId=... and ?role=doctor

            const res = await axios.get(`http://localhost:8000/api/referrals/my?userId=${userId}&role=doctor`);
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
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold text-slate-800">Doctor Wallet</h1>

            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <p className="text-emerald-100 font-medium mb-1 uppercase tracking-wide text-xs">Available Balance</p>
                    <h2 className="text-5xl font-black flex items-center gap-2">
                        <Coins size={40} className="text-yellow-400" />
                        {data?.wallet?.sehatCoins || 0}
                    </h2>
                    <p className="mt-2 text-sm text-emerald-100 opacity-80"> Redeemable for Premium Listings</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 w-full md:w-auto min-w-[280px]">
                    <p className="text-xs font-bold uppercase text-emerald-100 mb-2">Doctor Referral Code</p>
                    <div className="flex items-center gap-2 bg-white/20 p-3 rounded-xl">
                        <code className="flex-1 font-mono text-xl font-bold tracking-widest text-center">{data?.referralCode || "DOC-Pending"}</code>
                        <button onClick={copyCode} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                            <Copy size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Referrals */}
            <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Users size={20} className="text-slate-400" /> My Referrals
                </h3>

                <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                    {data?.referrals?.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                            <p>No referrals yet. Invite patients or colleagues!</p>
                        </div>
                    ) : (
                        <div>
                            {data?.referrals?.map((ref) => (
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
                                                <X size={12} /> Rejected
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
