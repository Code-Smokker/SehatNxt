"use client";

import React from 'react';
import Image from 'next/image';

const MapPreview = ({ lat, lng }) => {
    if (!lat || !lng) return null;

    const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    // Static map URL
    // Zoom: 15 (Street level)
    // Size: 600x300 (High res for retina)
    // Scale: 2 (Retina)
    // MapID: if you have a custom style, else standard
    const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=600x300&scale=2&markers=color:red%7C${lat},${lng}&key=${API_KEY}`;

    return (
        <div className="w-full h-40 bg-slate-100 rounded-xl overflow-hidden relative shadow-inner border border-slate-200 mt-4">
            <Image
                src={url}
                alt="Location Preview"
                fill
                className="object-cover"
                unoptimized // Static maps are already optimized
            />
            {/* Overlay Gradient for aesthetics */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default MapPreview;
