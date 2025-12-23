"use client";
import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            const doctorId = localStorage.getItem('doctor_id');
            if (!doctorId) return;
            try {
                const res = await axios.get(`http://localhost:8000/api/reviews/doctor/${doctorId}`);
                setReviews(res.data.reviews);
                setAvgRating(res.data.average);
                setTotalReviews(res.data.total);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const StarRating = ({ rating }) => {
        return (
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={16}
                        className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                            }`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-20 md:pb-0">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Reviews & Ratings</h1>
                    <p className="text-slate-500 mt-1">Patient feedback and satisfaction overview</p>
                </div>
                {/* Stats Badge */}
                <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <div className="text-center px-4 border-r border-slate-200">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Average</p>
                        <div className="flex items-center gap-1 justify-center">
                            <span className="text-2xl font-black text-slate-900">{avgRating}</span>
                            <Star size={20} className="fill-yellow-400 text-yellow-400" />
                        </div>
                    </div>
                    <div className="text-center px-4">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total</p>
                        <p className="text-xl font-bold text-slate-900">{totalReviews} <span className="text-sm font-normal text-slate-500">Reviews</span></p>
                    </div>
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="p-12 text-center text-slate-400">Loading feedback...</div>
                ) : reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                            <MessageSquare size={32} className="text-slate-300" />
                        </div>
                        <p className="text-lg font-bold text-slate-600">No reviews yet</p>
                        <p className="text-slate-400 text-sm">Patient feedback will appear here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg border border-blue-100">
                                            {review.patientId?.name?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{review.patientId?.name || "Unknown Patient"}</h3>
                                            <p className="text-xs text-slate-500 font-medium">
                                                {new Date(review.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <StarRating rating={review.rating} />
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100/50">
                                    <p className="text-slate-700 italic">"{review.review || "No written feedback"}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
