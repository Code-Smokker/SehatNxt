const options = {
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places', 'maps', 'geocoding'] // Add any other libraries you need
};

let loaderPromise = null;

export const loadGoogleMaps = () => {
    if (typeof window === 'undefined') return Promise.resolve();

    if (!loaderPromise) {
        loaderPromise = new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve(window.google.maps);
                return;
            }

            const existingScript = document.getElementById(options.id);
            if (existingScript) {
                // Already loading, wait for it
                existingScript.addEventListener('load', () => resolve(window.google.maps));
                existingScript.addEventListener('error', (e) => reject(e));
                return;
            }

            // Create script tag - Modern Bootstrap
            // See: https://developers.google.com/maps/documentation/javascript/load-maps-js-api
            const script = document.createElement('script');
            script.id = options.id;
            // The strict loading url with callback
            const callbackName = 'initMapCallback';
            window[callbackName] = () => {
                resolve(window.google.maps);
            };

            script.src = `https://maps.googleapis.com/maps/api/js?key=${options.googleMapsApiKey}&libraries=${options.libraries.join(',')}&callback=${callbackName}&loading=async`;
            script.async = true;
            script.defer = true;
            script.onerror = (err) => reject(err);

            document.head.appendChild(script);
            document.head.appendChild(script);
        });
    }

    return loaderPromise;
};

// Helper to get libraries safely using the new importLibrary
export const getGoogleLib = async (libName) => {
    await loadGoogleMaps();
    if (!window.google || !window.google.maps) throw new Error("Google Maps not loaded");
    return await window.google.maps.importLibrary(libName);
};
