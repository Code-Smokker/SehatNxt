/**
 * Reverse Geocoding Utility
 * Converts Lat/Lng -> Readable Address
 */
export const reverseGeocode = async (lat, lng) => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        if (!apiKey) throw new Error("Google Maps API Key missing");

        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            // Prefer results with "street_address" or "route" or "locality"
            const result = data.results[0];
            return {
                address: result.formatted_address,
                placeId: result.place_id,
                components: result.address_components
            };
        } else {
            console.warn("Geocoding failed:", data.status);
            return null;
        }
    } catch (error) {
        console.error("Reverse Geocoding Error:", error);
        return null;
    }
};
