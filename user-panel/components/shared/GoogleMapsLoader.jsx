"use client";

import { useEffect, useState } from 'react';
import { Loader } from "@googlemaps/js-api-loader";

export default function GoogleMapsLoader() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const initMap = async () => {
            if (window.google?.maps) {
                setIsLoaded(true);
                return;
            }

            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
            console.log("Debug Maps Key:", apiKey ? `Present (${apiKey.substring(0, 5)}...)` : "MISSING/UNDEFINED", "Env:", process.env.NODE_ENV);

            if (!apiKey) {
                console.warn("Google Maps API Key is missing. Maps will not be loaded.");
                return;
            }

            try {
                // Use standard Loader class which is reliable for v2+
                const { Loader } = await import("@googlemaps/js-api-loader");

                const loader = new Loader({
                    apiKey: apiKey,
                    version: "weekly",
                    libraries: ["places", "geometry", "maps", "marker"],
                });

                await loader.importLibrary("maps");
                await loader.importLibrary("places");
                await loader.importLibrary("marker");
                await loader.importLibrary("geometry");

                // Dynamically import the web components
                await import("@googlemaps/extended-component-library/place_picker.js");
                await import("@googlemaps/extended-component-library/place_overview.js");
                await import("@googlemaps/extended-component-library/overlay_layout.js");

                setIsLoaded(true);
            } catch (error) {
                console.error("Error loading Google Maps:", error);
            }
        };

        // Initialize immediately
        initMap();
    }, []);

    return null;
}
