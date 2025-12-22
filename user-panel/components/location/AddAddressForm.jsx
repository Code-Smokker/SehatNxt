"use client";

import React, { useState } from 'react';
import { useLocation } from '@/context/LocationContext';
import { Home, Briefcase, MapPin } from 'lucide-react';

const AddAddressForm = ({ defaultLocation, onCancel, onSuccess }) => {
    const { refreshAddresses } = useLocation();

    // We expect defaultLocation to have { fullAddress, lat, lng, placeId }
    const [formData, setFormData] = useState({
        label: "Home",
        address: defaultLocation?.fullAddress || "",
        landmark: "",
        flatNo: "", // New field
        lat: defaultLocation?.lat || 0,
        lng: defaultLocation?.lng || 0,
        placeId: defaultLocation?.placeId || ""
    });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!formData.address) return; // Basic validation
        setIsSaving(true);
        try {
            // Combine flatNo with address or send separately? 
            // Schema has `fullAddress`. Let's append if user provided flat info to make it robust.
            // Or ideally store structure. For now, we append to fullAddress or keep as is.
            // Let's keep fullAddress as the "Map Address" and use landmark/flatNo as extra details.

            // Actually, usually you want:
            // "Flat 101, [Map Address]"
            const finalAddress = formData.flatNo
                ? `${formData.flatNo}, ${formData.address}`
                : formData.address;

            const res = await fetch('/api/address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    fullAddress: finalAddress
                })
            });

            if (res.ok) {
                await refreshAddresses();
                onSuccess();
            } else {
                const err = await res.json();
                alert(`Failed: ${err.error || 'Unknown error'}`);
            }
        } catch (e) {
            console.error(e);
            alert("Network error.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 pt-2 animate-fadeIn">
            {/* Address Display */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex gap-3">
                <div className="mt-1 min-w-[24px]">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <MapPin size={14} className="text-blue-600" />
                    </div>
                </div>
                <div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Selected Location</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        {formData.address}
                    </p>
                </div>
            </div>

            {/* Manual Fields */}
            <div className="space-y-4">
                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">House / Flat / Block No.</label>
                    <input
                        type="text"
                        value={formData.flatNo}
                        onChange={(e) => setFormData({ ...formData, flatNo: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm font-semibold text-slate-800 placeholder:font-normal transition-all"
                        placeholder="e.g. Flat 402, Tower A"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Landmark (Optional)</label>
                    <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 text-sm font-semibold text-slate-800 placeholder:font-normal transition-all"
                        placeholder="e.g. Near HDFC Bank"
                    />
                </div>
            </div>

            {/* Label Selection */}
            <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Save As</label>
                <div className="flex gap-3">
                    <LabelBtn
                        label="Home"
                        icon={<Home size={16} />}
                        active={formData.label === 'Home'}
                        onClick={() => setFormData({ ...formData, label: 'Home' })}
                    />
                    <LabelBtn
                        label="Work"
                        icon={<Briefcase size={16} />}
                        active={formData.label === 'Work'}
                        onClick={() => setFormData({ ...formData, label: 'Work' })}
                    />
                    <LabelBtn
                        label="Other"
                        icon={<MapPin size={16} />}
                        active={formData.label === 'Other'}
                        onClick={() => setFormData({ ...formData, label: 'Other' })}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-lg shadow-slate-200 disabled:opacity-70 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                >
                    {isSaving ? "Saving Address..." : "Save Address"}
                </button>
            </div>
        </div>
    );
};

const LabelBtn = ({ label, icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex flex-col items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-200
            ${active
                ? 'bg-red-50 border-red-500 text-red-600 shadow-sm'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:border-slate-300'
            }
        `}
    >
        {/* Simple logic: Blinkit often uses Red/Brand color for active labels */}
        <div className={active ? "text-red-500" : "text-slate-400"}>{icon}</div>
        <span className="text-xs font-bold">{label}</span>
    </button>
);

export default AddAddressForm;
