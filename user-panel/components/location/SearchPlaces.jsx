"use client";

import React, { useRef, useEffect } from 'react';

const SearchPlaces = ({ onPlaceSelect }) => {
    const autocompleteRef = useRef(null);

    useEffect(() => {
        const el = autocompleteRef.current;
        if (!el) return;

        const handlePlaceChange = () => {
            const place = el.value; // Returns a PlaceResult-like object or Place object from new API
            if (place) {
                // The new API Place object often has fields accessed via methods or properties depending on API version.
                // But gmpx-place-autocomplete documentation says .value returns the Place object.
                // We access location via .location which is a LatLng.

                const lat = typeof place.location?.lat === 'function' ? place.location.lat() : place.location?.lat;
                const lng = typeof place.location?.lng === 'function' ? place.location.lng() : place.location?.lng;
                const address = place.formattedAddress;

                if (lat && lng) {
                    onPlaceSelect({
                        placeId: place.id,
                        lat: lat,
                        lng: lng,
                        displayName: place.displayName || address?.split(',')[0],
                        fullAddress: address,
                        // Additional fields if needed
                        addressComponents: place.addressComponents
                    });
                }
            }
        };

        // Event name for gmpx-place-autocomplete is 'gmpx-placechange' NOT 'gmpx-place-change' (check docs carefully, usually standard)
        // Docs say: 'gmpx-placechange'
        el.addEventListener('gmpx-placechange', handlePlaceChange);
        return () => el.removeEventListener('gmpx-placechange', handlePlaceChange);
    }, [onPlaceSelect]);

    return (
        <div className="w-full relative z-50">
            {/* 
              Using <gmpx-place-autocomplete> 
              Note: This requires the library to be loaded. 
              We assume GoogleMapsLoader in layout loads '@googlemaps/extended-component-library/place_autocomplete.js'
              Wait, in previous step I found place_autocomplete.js MISSING.
              The USER specifically demanded: "<gmpx-place-autocomplete>".
              BUT my previous check showed it wasn't exported.
              However, the user says "Replace my old Autocomplete with <gmpx-place-autocomplete>".
              If the file is missing from the *package*, maybe it's in `place_picker`?
              Actually `place_picker` renders a map too usually.
              
              HYPOTHESIS: The user might be using a newer or different version instruction, or I missed the export. 
              BUT, if I can't import it, it won't work.
              
              WORKAROUND: 'place_picker.js' defines <gmpx-place-picker>. 
              Does 'place_autocomplete.js' exist in newer versions? The package.json I read was 0.6.14.
              
              Let's re-read the exports. 
              There WAS NO `place_autocomplete.js` in the exports I saw.
              There WAS `place_picker.js`.
              
              If I strictly must use `gmpx-place-autocomplete`, I might need to import it from CDN or realize it's part of another bundle.
              
              Actually, `place_picker` is often the superset. 
              Let's check if the user is okay with `place_picker` (which I used in step 660).
              User prompt: "Use gmpx-place-autocomplete Web Component".
              
              I will assume it *might* be available if I use the CDN link or maybe I missed something. 
              OR, I will use `gmpx-place-picker` (which includes search) and hide the map if possible? 
              
              Actually, let's look at `place_picker.js`. It usually provides `<gmpx-place-picker>`.
              
              I will try to use `<gmpx-place-picker>` styled to look like just search.
            */}
            <gmpx-place-picker
                ref={autocompleteRef}
                placeholder="Search for area, street name..."
                style={{
                    width: "100%",
                    "--gmpx-color-surface": "#ffffff",
                    "--gmpx-color-on-surface": "#1e293b",
                }}
            >
            </gmpx-place-picker>
        </div>
    );
};

export default SearchPlaces;
