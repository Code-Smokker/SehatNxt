"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Shield, CheckCircle2, Wallet, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { bookAppointment } from '@/actions/appointment';
import Image from 'next/image';

const PaymentSummaryContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Extract booking details from URL
    const doctorId = searchParams.get('doctorId');
    const doctorName = searchParams.get('doctorName');
    const doctorSpecialty = searchParams.get('specialty');
    const doctorImage = searchParams.get('image');
    const selectedDate = searchParams.get('date');
    const selectedSlot = searchParams.get('time');
    const fees = searchParams.get('fees');
    const mode = searchParams.get('mode'); // 'clinic' or 'chat'
    const clinicAddress = searchParams.get('address');

    const [isBooking, setIsBooking] = useState(false);
    const [sehatCashBalance, setSehatCashBalance] = useState(100); // Mock balance

    const handleConfirm = async () => {
        setIsBooking(true);
        const bookingData = {
            doctorId,
            doctorName,
            specialty: doctorSpecialty,
            date: selectedDate,
            time: selectedSlot,
            mode,
            fees: parseInt(fees),
        };

        const savedLoc = localStorage.getItem("userLocation");
        if (savedLoc) {
            bookingData.userLocation = JSON.parse(savedLoc);
        }

        try {
            const result = await bookAppointment(bookingData);

            if (result.success) {
                const queryString = new URLSearchParams({
                    doctorName: bookingData.doctorName,
                    date: bookingData.date,
                    time: bookingData.time,
                    fees: bookingData.fees,
                    mode: bookingData.mode
                }).toString();
                router.push(`/appointment-success?${queryString}`);
            } else {
                alert("Failed: " + result.error);
                setIsBooking(false);
            }
        } catch (error) {
            console.error("Booking Error:", error);
            alert("Failed to book appointment. Please try again.");
            setIsBooking(false);
        }
    };

    if (!doctorId) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-32">
            {/* 1. Header */}
            <div className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 flex items-center justify-between px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition">
                        <ChevronLeft size={22} className="text-slate-700" />
                    </button>
                    <div>
                        <h1 className="text-base font-bold text-slate-800 leading-tight">Payment Summary</h1>
                        <p className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                            <Shield size={10} className="text-green-500 fill-green-500" /> Secure & transparent billing
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 mt-4 space-y-6">

                {/* 2. Doctor Fee Card (Faded - Free for Now) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden opacity-90">
                    <div className="absolute top-0 right-0 bg-green-50 px-3 py-1 rounded-bl-xl border-b border-l border-green-100">
                        <span className="text-[10px] font-bold text-green-700 tracking-wide uppercase">Free for now</span>
                    </div>

                    <div className="flex gap-4">
                        <div className="relative w-14 h-14 flex-shrink-0">
                            <Image
                                src={doctorImage || "https://randomuser.me/api/portraits/lego/1.jpg"}
                                alt={doctorName || 'Doctor'}
                                fill
                                sizes="(max-width: 768px) 20vw, 10vw"
                                className="rounded-xl object-cover bg-slate-100 grayscale-[0.2]"
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-800">{doctorName}</h3>
                            <p className="text-xs text-slate-500 font-medium">{doctorSpecialty} • {mode === 'clinic' ? 'Clinic Visit' : 'Video/Chat'}</p>
                            <p className="text-xs text-slate-400 mt-1">{new Date(selectedDate).toDateString()} • {selectedSlot}</p>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-semibold text-slate-500">Consultation Fee</span>
                        <div className="text-right">
                            <span className="text-xs text-slate-400 line-through mr-2">₹{fees}</span>
                            <span className="text-sm font-bold text-green-600">₹0</span>
                        </div>
                    </div>
                </div>

                {/* 3. Bill Breakdown */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Bill Details</h4>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Doctor Fee</span>
                            <span className="text-sm font-medium text-slate-400 line-through">₹{fees}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Platform Fee</span>
                            <span className="text-sm font-medium text-slate-400 line-through">₹10</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-600">Taxes & GST</span>
                            <span className="text-sm font-medium text-slate-400 line-through">₹2</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-800">To Pay</span>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-lg font-bold text-slate-900">₹0</span>
                            <span className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">Limited-time offer</span>
                        </div>
                    </div>
                </div>

                {/* 4. Sehat Cash */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <Wallet size={16} className="text-blue-300" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold">Sehat Cash</h4>
                            <p className="text-[10px] text-slate-400">Your health wallet</p>
                        </div>
                        <div className="ml-auto">
                            <span className="text-lg font-bold">₹{sehatCashBalance}</span>
                        </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                            <CheckCircle2 size={12} className="text-slate-600" />
                            No Sehat Cash used for this free booking
                        </p>
                    </div>
                </div>

                {/* 5. Payment Methods (Disabled) */}
                <div className="opacity-50 pointer-events-none grayscale">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">Payment Options</h4>
                    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                        <PaymentRow icon={<Smartphone size={18} />} label="UPI Apps" sub="Google Pay, PhonePe, Paytm" />
                        <PaymentRow icon={<CreditCard size={18} />} label="Cards" sub="Visa, Mastercard, RuPay" />
                        <PaymentRow icon={<Banknote size={18} />} label="Net Banking" sub="All Indian banks" />
                    </div>
                    <p className="text-[10px] text-center text-slate-400 mt-2">Payment not required for this booking</p>
                </div>
            </div>

            {/* 6. Sticky CTA */}
            <div className="fixed bottom-0 w-full left-0 bg-white border-t border-slate-100 p-4 pb-8 z-50 rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
                < div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs text-slate-400 font-medium line-through">₹{parseInt(fees) + 12}</p>
                        <p className="text-xl font-bold text-slate-900">₹0 <span className="text-xs font-medium text-slate-500">Payable</span></p>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={isBooking}
                        className="bg-gradient-to-r from-slate-900 to-slate-800 hover:to-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-slate-200 transition-all active:scale-95 flex-1"
                    >
                        {isBooking ? 'Processing...' : 'Confirm Appointment'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PaymentRow = ({ icon, label, sub }) => (
    <div className="flex items-center gap-4 p-4 border-b border-slate-50 last:border-none">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
            {icon}
        </div>
        <div>
            <h5 className="text-sm font-bold text-slate-700">{label}</h5>
            <p className="text-[10px] text-slate-400">{sub}</p>
        </div>
    </div>
);

const PaymentSummaryPage = () => {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading Payment Details...</div>}>
            <PaymentSummaryContent />
        </Suspense>
    );
};

export default PaymentSummaryPage;
