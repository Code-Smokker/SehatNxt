"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, MessageSquare, Search } from 'lucide-react';

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/reviews`);
                setReviews(res.data);
            } catch (err) {
                console.error("Failed to fetch reviews", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const filteredReviews = reviews.filter(rev =>
        rev.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.review?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const StarRating = ({ rating }) => (
        <div className="flex space-x-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={14}
                    className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-200'}`}
                />
            ))}
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Platform Reviews</h1>
                    <p className="text-slate-500">Monitor all patient feedback across the platform</p>
                </div>
            </div>

            {/* Stats Overview (Optional) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-slate-500 font-medium mb-1">Total Reviews</p>
                    <h3 className="text-3xl font-bold text-slate-900">{reviews.length}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-slate-500 font-medium mb-1">Average Rating</p>
                    <div className="flex items-center gap-2">
                        <h3 className="text-3xl font-bold text-slate-900">
                            {reviews.length > 0
                                ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
                                : '0.0'
                            }
                        </h3>
                        <Star className="fill-yellow-400 text-yellow-400" size={24} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <p className="text-slate-500 font-medium mb-1">5-Star Reviews</p>
                    <h3 className="text-3xl font-bold text-slate-900">
                        {reviews.filter(r => r.rating === 5).length}
                    </h3>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex items-center gap-3">
                <Search className="text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search by doctor, patient, or review text..."
                    className="flex-1 outline-none text-slate-700"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* List */}
            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Doctor</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Patient</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Rating</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Review</th>
                            <th className="p-4 font-semibold text-slate-600 text-sm">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-slate-400">Loading reviews...</td>
                            </tr>
                        ) : filteredReviews.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                            <MessageSquare className="text-slate-300" />
                                        </div>
                                        <p className="text-slate-500 font-medium">No reviews found</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredReviews.map((review) => (
                                <tr key={review._id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{review.doctorId?.name || 'Unknown Doctor'}</div>
                                        <div className="text-xs text-slate-500">{review.doctorId?.specialty}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-slate-900">{review.patientId?.name || 'Unknown User'}</div>
                                    </td>
                                    <td className="p-4">
                                        <StarRating rating={review.rating} />
                                    </td>
                                    <td className="p-4 max-w-xs">
                                        <p className="text-slate-600 text-sm line-clamp-2">{review.review || '-'}</p>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
