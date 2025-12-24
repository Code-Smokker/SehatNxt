"use client";

import { useEffect, useState } from 'react';
import { importLibrary } from "@googlemaps/js-api-loader";

export default function GoogleMapsLoader() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const initMap = async () => {
            // Check if maps is already available
            try {
                // If the google namespace exists and maps is loaded, we can skip
                if (window.google?.maps) {
                    setIsLoaded(true);
                    return;
                }

                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                if (!apiKey) {
                    console.warn("Google Maps API Key is missing");
                    return;
                }

                // In v2+, we can use importLibrary directly without Loader class
                // First, we can try to bootstrap it if needed, but importLibrary usually handles it.
                // However, the error suggests using setOptions is the way if Loader is deprecated.
                // We will dynamically import the entry point.

                const { setOptions, importLibrary } = await import("@googlemaps/js-api-loader");

                setOptions({
                    apiKey: apiKey,
                    version: "weekly",
                    libraries: ["places", "geometry", "maps", "marker"],
                });

                await importLibrary("maps");
                await importLibrary("places");
                await importLibrary("marker");
                await importLibrary("geometry");

                // Dynamically import the web components
                await import("@googlemaps/extended-component-library/place_picker.js");
                await import("@googlemaps/extended-component-library/place_overview.js");
                await import("@googlemaps/extended-component-library/overlay_layout.js");

                setIsLoaded(true);
            } catch (error) {
                console.error("Error loading Google Maps:", error);
            }
        };

        initMap();
    }, []);

    return null;
}
