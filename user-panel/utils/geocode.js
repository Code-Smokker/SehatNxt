/**
 * Reverse Geocoding Utility
 * Converts Lat/Lng -> Readable Address
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        // const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        // if (!apiKey) throw new Error("Google Maps API Key missing");

        // Use Backend Proxy
        const url = `/api/maps/geocode?lat=${lat}&lng=${lng}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.success) {
            return {
                address: data.fullAddress,
                placeId: data.raw?.place_id,
                components: data.raw?.address_components
            };
        } else {
            console.warn("Geocoding failed:", data.error);
            return null;
        }
    } catch (error) {
        console.error("Reverse Geocoding Error:", error);
        return null;
    }
};
