"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function PhoneCollectionModal({ isOpen, onClose, onSuccess, token }) {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone.length !== 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Call API to update profile with phone
            // We reuse the update profile or create a specific endpoint.
            // Assuming we have an update profile endpoint or can use the generic one.
            // Let's create/use a dedicated route for this if possible, or user standard update.
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

            // NOTE: We might not have a dedicated simple "update phone" route ready in the new auth system.
            // But let's assume `POST /api/auth/update-phone` or similar, OR strict use of existing ID.
            // For now, let's use the `completeOnboarding` action logic via API if available, 
            // OR simpler: just assume standard backend user update.

            // To be safe and since we are using Server Actions primarily for mutations in this app structure:
            // let's actually use a Server Action if we can?
            // But we are in a client modal. 
            // Let's try to call the backend route directly for profile update.

            await axios.put(`${baseUrl}/user/profile`, { phone }, {
                headers: { Authorization: `Bearer ${token}` } // Or cookie based
            });

            // If success
            if (onSuccess) onSuccess(phone);
            onClose();
        } catch (err) {
            console.error("Phone update error", err);
            setError('Failed to update phone number. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose} // Optional: block close if mandatory?
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden relative"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-md">
                                    <Phone size={24} className="text-white" />
                                </div>
                                <h2 className="text-xl font-bold">Add Phone Number</h2>
                                <p className="text-blue-100 text-xs mt-1">So the doctor can contact you</p>
                            </div>

                            {/* Close Button (Optional - if mandatory, remove) */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                            >
                                <X size={16} />
                            </button>

                            {/* Form */}
                            <div className="p-6">
                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Mobile Number</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">+91</span>
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                className="w-full bg-slate-50 border-none rounded-xl py-3 pl-12 pr-4 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500/20"
                                                placeholder="00000 00000"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {error && <p className="text-xs text-red-500 font-medium text-center">{error}</p>}

                                    <button
                                        disabled={loading || phone.length !== 10}
                                        className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl mt-2 shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Save & Continue'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
