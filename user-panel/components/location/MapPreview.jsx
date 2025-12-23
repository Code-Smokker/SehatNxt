"use client";

import React from 'react';
import Image from 'next/image';

const MapPreview = ({ lat, lng }) => {
    if (!lat || !lng) return null;

    // const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // REMOVED
    // Use Backend Proxy for Static Map
    const url = `/api/maps/static?lat=${lat}&lng=${lng}`;

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
