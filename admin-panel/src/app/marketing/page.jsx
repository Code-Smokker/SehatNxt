"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit2, Eye, EyeOff, X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';
import Image from "next/image";

// Use relative path for Next.js API routes
const API_URL = '';


const MarketingManager = () => {
    const [slides, setSlides] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const [form, setForm] = useState({
        title: '',
        description: '',
        imageUrl: '',
        ctaText: 'Learn More',
        ctaLink: '/',
        isActive: true,
        order: 0
    });

    const fetchSlides = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/slider`);
            if (res.data.success) {
                setSlides(res.data.data);
                setError(null);
            } else {
                setError('Failed to load slides');
            }
        } catch (error) {
            console.error("Fetch error", error);
            setError(error.response?.data?.message || 'Server connection failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            if (editingSlide) {
                await axios.put(`${API_URL}/api/slider/${editingSlide._id}`, form);
            } else {
                await axios.post(`${API_URL}/api/slider`, form);
            }
            setIsModalOpen(false);
            setEditingSlide(null);
            resetForm();
            fetchSlides();
        } catch (error) {
            console.error("Save error", error);
            setError(error.response?.data?.message || "Failed to save slide");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this slide?")) return;
        try {
            await axios.delete(`${API_URL}/api/slider/${id}`);
            fetchSlides();
        } catch (error) {
            alert("Delete failed");
        }
    };

    const toggleStatus = async (slide) => {
        try {
            await axios.put(`${API_URL}/api/slider/${slide._id}`, { isActive: !slide.isActive });
            fetchSlides();
        } catch (error) {
            alert("Status update failed");
        }
    };

    const resetForm = () => {
        setForm({ title: '', description: '', imageUrl: '', ctaText: 'Learn More', ctaLink: '/', isActive: true, order: 0 });
    }

    const openEdit = (slide) => {
        setEditingSlide(slide);
        setForm(slide);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Marketing Sliders</h1>
                    <p className="text-slate-500 text-sm">Manage Home Page promotional banners</p>
                </div>
                <button
                    onClick={() => { setEditingSlide(null); resetForm(); setIsModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                >
                    <Plus size={18} /> Add New Slide
                </button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-center gap-2 text-sm font-medium">
                    <Info size={18} /> {error}
                </div>
            )}

            {loading ? (
                <div className="text-center py-20 text-slate-400 flex flex-col items-center">
                    <Loader2 className="animate-spin mb-2" />
                    Loading slides...
                </div>
            ) : slides.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-lg font-bold text-slate-600">No Slides Found</h3>
                    <p className="text-slate-400 text-sm">Create your first marketing banner to display on the app.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {slides.map(slide => (
                        <div key={slide._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden flex flex-col ${!slide.isActive ? 'opacity-60 grayscale' : ''}`}>
                            <div className="relative h-40 w-full bg-slate-100">
                                <Image src={slide.imageUrl} alt={slide.title} fill className="object-cover" unoptimized />
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                                    Order: {slide.order}
                                </div>
                            </div>
                            <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-slate-800 line-clamp-1" title={slide.title}>{slide.title}</h3>
                                    <button onClick={() => toggleStatus(slide)} className={`p-1 rounded-full ${slide.isActive ? 'text-green-500 bg-green-50' : 'text-slate-400 bg-slate-100'}`}>
                                        {slide.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mb-4 line-clamp-2 h-8">{slide.description}</p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
                                    <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded line-clamp-1 max-w-[100px]">{slide.ctaLink}</span>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(slide)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(slide._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                            <X size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-800 mb-6">{editingSlide ? 'Edit Slide' : 'New Marketing Slide'}</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Title</label>
                                    <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Summer Checkup" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">Order Priority</label>
                                    <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="0" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Image URL (S3/External)</label>
                                <input required value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Description</label>
                                <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows="2" placeholder="Short description..." />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">CTA Text</label>
                                    <input required value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Book Now" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-600 mb-1">CTA Link</label>
                                    <input required value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="/doctors" />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <input type="checkbox" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} id="isActive" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">Set as Active</label>
                            </div>

                            <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl mt-4 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                                {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                                {saving ? 'Saving...' : 'Save Slide'}
                            </button>

                            {error && (
                                <p className="text-xs text-center text-red-500 font-medium">{error}</p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple Info Icon Component since I didn't import it at top
const Info = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
);

export default MarketingManager;
