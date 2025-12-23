"use client";
import { useState } from 'react';
import axios from 'axios';
import { X, Loader2 } from 'lucide-react';

export default function AddPatientModal({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: '', phone: '', age: '', gender: 'Male', email: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await axios.post('http://localhost:8000/api/patients', formData);
            onSuccess();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add patient');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
                <button onClick={onClose} className="absolute right-4 top-4 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Patient</h2>

                {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">Full Name</label>
                        <input required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Age</label>
                            <input required type="number" className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                                value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-slate-700 block mb-1">Gender</label>
                            <select className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100 bg-white"
                                value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1">Phone Number</label>
                        <input required className="w-full border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-100"
                            value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors flex justify-center">
                        {loading ? <Loader2 className="animate-spin" /> : 'Register Patient'}
                    </button>
                </form>
            </div>
        </div>
    );
}
