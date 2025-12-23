/* eslint-disable no-undef */

// Singleton promise to prevent multiple loads
let loaderPromise = null;

/**
 * Loads a Google Maps library safely.
 * @param {string} lib - The library name (e.g., "places", "maps", "geometry")
 * @returns {Promise<any>} - The requested library object
 */
export const getGoogleLib = async (lib) => {
    if (typeof window === 'undefined') return null;

    // 1. If already loaded globally (e.g. by another component)
    if (window.google?.maps?.[lib]) {
        return window.google.maps[lib];
    }

    // 2. Try to use importLibrary from the global google object if available (native bootstrap)
    if (window.google?.maps?.importLibrary) {
        return window.google.maps.importLibrary(lib);
    }

    // 3. Initialize loader if not already doing so
    if (!loaderPromise) {
        loaderPromise = (async () => {
            try {
                // Dynamically import the loader to avoid top-level evaluation crashes
                const module = await import("@googlemaps/js-api-loader");

                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
                const options = {
                    apiKey,
                    version: "weekly",
                    libraries: ["places", "geometry", "maps", "marker"]
                };

                // Pattern A: Modern functional API (Loader v3+)
                // Although error says "Loader class is no longer available", v3 usually still has imports? 
                // Error says: "use setOptions() and importLibrary()"
                if (module.importLibrary && module.setOptions) {
                    module.setOptions(options);
                    // We don't return here, we just initialized the singleton options.
                    // The actual library fetch happens below.
                    return;
                }

                // Pattern B: Loader Class (v2 or older, or if present)
                if (module.Loader) {
                    const loader = new module.Loader(options);
                    await loader.load();
                    return;
                }

                // Fallback: If neither works, we rely on GoogleMapsLoader.jsx having done the job, 
                // or we log a warning.
                console.warn("Google Maps Loader strategy unclear. Waiting for global google.maps...");

            } catch (e) {
                console.error("Failed to load Google Maps lib", e);
                // Reset promise so retry is possible? 
                // loaderPromise = null; 
                throw e;
            }
        })();
    }

    // Wait for initialization to complete
    await loaderPromise;

    // 4. Return the library
    if (window.google?.maps?.[lib]) {
        return window.google.maps[lib];
    }
    // Try importLibrary again if available on global now
    if (window.google?.maps?.importLibrary) {
        return window.google.maps.importLibrary(lib);
    }

    throw new Error(`Google Maps library '${lib}' could not be loaded. Ensure API Key is valid.`);
};
