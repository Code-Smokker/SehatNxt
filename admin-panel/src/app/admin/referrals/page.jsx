"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, X, Clock, User, Award } from 'lucide-react';

const API_URL = 'http://localhost:8000/api/referrals/admin/all';

const ReferralManagement = () => {
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReferrals();
    }, []);

    const fetchReferrals = async () => {
        try {
            const res = await axios.get(API_URL);
            setReferrals(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') {
                const coins = prompt("Enter coins (default 50):", "50");
                if (coins === null) return;
                await axios.put(`http://localhost:8000/api/referrals/admin/${id}/approve`, { coins: parseInt(coins) });
                alert("Approved!");
            } else {
                if (!confirm("Reject this referral?")) return;
                await axios.put(`http://localhost:8000/api/referrals/admin/${id}/reject`);
                alert("Rejected!");
            }
            fetchReferrals();
        } catch (err) {
            alert("Action Failed");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Award className="text-yellow-500" /> Referral Requests
            </h1>

            {loading ? <p>Loading...</p> : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="p-4 font-semibold text-gray-600">Referrer</th>
                                <th className="p-4 font-semibold text-gray-600">Referee</th>
                                <th className="p-4 font-semibold text-gray-600">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {referrals.map((ref) => (
                                <tr key={ref._id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-800">{ref.referrerId?.name || "Unknown"}</div>
                                        <div className="text-xs text-gray-500">{ref.referrerRole}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-700">{ref.refereeId?.name}</div>
                                        <div className="text-xs text-gray-500">{new Date(ref.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${ref.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                ref.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {ref.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        {ref.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(ref._id, 'approve')}
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs font-bold"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(ref._id, 'reject')}
                                                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs font-bold"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {referrals.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-400">No referrals found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ReferralManagement;
