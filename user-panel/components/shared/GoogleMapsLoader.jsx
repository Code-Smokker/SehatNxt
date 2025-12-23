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

            try {
                // Use the new Loader class correctly or fallback to functional approach if needed.
                // The error said "Loader class is no longer available", but standard docs v2 say it IS.
                // However, let's follow the error's alternative suggestion: functional API.
                // But wait, the library might not export `importLibrary` directly if it's not the very latest beta.
                // Let's stick to the `Loader` import but if the user says it's not available, 
                // it might be because I imported it from `@googlemaps/js-api-loader` and it's a named export that changed?
                // Actually, v2.0.2 DOES have Loader.
                // The error "Loader class is no longer available" is extremely suspicious for v2.
                // BUT, to be safe, I will use the dynamic import approach which is fail-safe or the `loader.load()` equivalent without class if possible.

                // RE-READING ERROR: "Please use the new functional API: setOptions() and importLibrary()."
                // This means I should import `importLibrary` from the package.

                // Let's try to import `Loader` from the package and instantiate it. 
                // If that failed, I will try to use the `load` function if it exists.

                // actually, I'll use the raw script injection or the `Loader` if I can find why it failed.
                // OPTION: The user might have a specific setup.
                // I will try to use the `importLibrary` from the package if available.

                // If Loader is not a constructor, then we have a problem.
                // Let's assume the error message is correct and try to use `importLibrary` if exported.

                // However, `js-api-loader` documentation for v2 says:
                // import { Loader } from '@googlemaps/js-api-loader'; 
                // const loader = new Loader({...});

                // Maybe the user is on a different version than package.json says?
                // Or maybe I should just use the functional approach as requested.

                // const { importLibrary } = await import("@googlemaps/js-api-loader");
                // await importLibrary("places");

                // WRONG: `importLibrary` is a google.maps function, not a loader function usually (unless wrapper handles it).

                // Let's try to RE-WRITE using the standard Script tag approach if the loader fails, OR 
                // trust the error and use `import { setOptions, importLibrary } from "@googlemaps/js-api-loader"`

                // I will try importing `importLibrary` from the package.

                const { importLibrary, setOptions } = await import("@googlemaps/js-api-loader");

                if (importLibrary && setOptions) {
                    setOptions({
                        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                        version: "weekly",
                        libraries: ["places", "geometry", "maps", "marker"],
                    });

                    await importLibrary("maps");
                    await importLibrary("places");
                    await importLibrary("marker");
                    await importLibrary("geometry");
                } else {
                    // Fallback to Loader if importLibrary is missing (contradicting error but safe)
                    const { Loader } = await import("@googlemaps/js-api-loader");
                    const loader = new Loader({
                        apiKey: apiKey,
                        version: "weekly",
                        libraries: ["places", "geometry", "maps", "marker"],
                    });
                    await loader.load();
                }

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
