"use client";
import React, { useState } from 'react';
import { Star, X, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function ReviewModal({ appointment, onClose, onSuccess }) {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [hover, setHover] = useState(0);

    const handleSubmit = async () => {
        if (rating === 0) return alert("Please select a rating");
        setSubmitting(true);
        try {
            await axios.post('http://localhost:8000/api/reviews', {
                doctorId: appointment.doctorId,
                patientId: appointment.patientId || appointment.userId, // Fallback if populated differently
                appointmentId: appointment._id,
                rating,
                review
            });
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl scale-100 animate-in zoom-in-95 duration-200 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl font-bold text-blue-600 border border-blue-100">
                        {appointment.doctorName?.[0] || 'D'}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Rate Your Experience</h3>
                    <p className="text-sm text-slate-500">How was your visit with <span className="font-semibold text-slate-700">{appointment.doctorName}</span>?</p>
                </div>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className="transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        >
                            <Star
                                size={32}
                                className={`${star <= (hover || rating)
                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm'
                                        : 'text-slate-200 fill-slate-50'
                                    } transition-colors duration-200`}
                                strokeWidth={1.5}
                            />
                        </button>
                    ))}
                </div>

                {/* Review Text */}
                <textarea
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-slate-400"
                    rows="3"
                    placeholder="Write a review (optional)..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : "Submit Review"}
                </button>
            </div>
        </div>
    );
}
