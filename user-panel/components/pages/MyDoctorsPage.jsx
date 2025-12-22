"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Heart, Loader2 } from 'lucide-react';
import { getSavedDoctors } from '@/actions/savedDoctor';
import Image from 'next/image';

const MyDoctorsPage = () => {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const data = await getSavedDoctors();
                setDoctors(data);
            } catch (error) {
                console.error("Failed to fetch saved doctors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <Loader2 className="animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header handled by Navbar */}

            <div className="p-4 grid gap-4">
                {doctors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                        <Heart size={48} className="mb-4 opacity-50" />
                        <p>No saved doctors yet.</p>
                        <p className="text-xs">Doctors you bookmark will appear here.</p>
                        <button
                            onClick={() => router.push('/book-appointment')}
                            className="mt-4 text-blue-600 font-bold text-sm hover:underline"
                        >
                            Find Doctors
                        </button>
                    </div>
                ) : (
                    doctors.map(doc => (
                        <div key={doc._id || doc.id} onClick={() => router.push(`/book-appointment/${doc._id || doc.id}`)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 cursor-pointer active:scale-[98%] transition-transform hover:shadow-md">
                            <div className="relative w-20 h-20 flex-shrink-0">
                                <Image
                                    src={doc.image || "https://randomuser.me/api/portraits/lego/1.jpg"}
                                    alt={doc.name}
                                    fill
                                    className="rounded-xl object-cover bg-slate-100"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight">{doc.name}</h3>
                                <p className="text-sm text-blue-600 font-medium mb-1">{doc.speciality || doc.specialty}</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                                        <Star size={10} className="text-amber-500 fill-amber-500" />
                                        <span className="text-xs font-bold text-amber-700">{doc.rating || "4.8"}</span>
                                    </div>
                                    <span className="text-xs text-slate-400">({doc.reviews || 12} Reviews)</span>
                                </div>
                                <button className="text-xs bg-slate-900 text-white px-3 py-2 rounded-lg font-semibold w-full mt-1">Book Again</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyDoctorsPage;
