"use client";

import { useEffect } from 'react';
import { loadGoogleMaps } from '@/utils/googleMaps';

export default function GoogleMapsLoader() {
    useEffect(() => {
        const init = async () => {
            await loadGoogleMaps();
            // Dynamic import for Web Components
            try {
                await import("@googlemaps/extended-component-library/place_picker.js");
            } catch (e) {
                console.error("WC Import Error", e);
            }
        };
        init();
    }, []);

    return null;
}
