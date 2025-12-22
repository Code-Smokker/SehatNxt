/**
 * Generate Static Map URL
 */
export const getStaticMapUrl = (lat, lng, zoom = 15, width = 600, height = 300) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return "";

    // Style cleanup for cleaner look (optional)
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&maptype=roadmap&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
};

export const getGoogleMapsDeepLink = (lat, lng) => {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
};
