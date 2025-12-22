"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Wallet, History, CreditCard, ArrowUpRight, ArrowDownLeft } from "lucide-react";

const PaymentsPage = () => {
    const router = useRouter();

    const transactions = [
        { id: 1, title: "Added to Wallet", date: "22 Dec, 2024", amount: "+ ₹500", type: "credit" },
        { id: 2, title: "Dr. Emily Appointment", date: "20 Dec, 2024", amount: "- ₹0", type: "debit" }, // Free booking example
        { id: 3, title: "Sign-up Bonus", date: "15 Dec, 2024", amount: "+ ₹100", type: "credit" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-50 px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition text-slate-600"
                >
                    <ChevronLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-slate-800">Payments & Sehat Cash</h1>
            </div>

            <div className="p-5 flex flex-col gap-6">

                {/* Wallet Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-xl shadow-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                                    <Wallet size={20} className="text-blue-300" />
                                </div>
                                <span className="text-sm font-medium text-slate-300">Sehat Cash Balance</span>
                            </div>
                            <span className="text-xs bg-white/20 px-2 py-1 rounded-lg backdrop-blur-md">Active</span>
                        </div>

                        <div>
                            <h2 className="text-4xl font-bold">₹600</h2>
                            <p className="text-xs text-slate-400 mt-1">Useful for booking appointments & medicines</p>
                        </div>

                        <div className="flex gap-3">
                            <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:bg-slate-50 transition active:scale-95">
                                Add Money
                            </button>
                        </div>
                    </div>
                </div>

                {/* Offer Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                        <CreditCard size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-800">Get 5% Cashback</h3>
                        <p className="text-xs text-slate-500 leading-snug">Use Sehat Cash for medicine orders & get instant cashback.</p>
                    </div>
                </div>

                {/* Transaction History */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <History size={18} className="text-slate-400" /> Recent Transactions
                    </h3>

                    <div className="flex flex-col gap-3">
                        {transactions.map((tx) => (
                            <div key={tx.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                                        {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{tx.title}</h4>
                                        <p className="text-[10px] text-slate-400">{tx.date}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>
                                    {tx.amount}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PaymentsPage;
