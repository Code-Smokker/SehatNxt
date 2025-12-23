/**
 * Get Air Quality Index (AQI)
 * Uses Backend Proxy to fetch AQI data
 */
export const getAirQuality = async (lat, lng) => {
    try {
        const response = await fetch(`/api/aqi?lat=${lat}&lng=${lng}`);
        const data = await response.json();

        if (data.success) {
            return data.data; // { aqi: number, level: string, message: string }
        } else {
            console.warn("AQI Fetch Failed:", data.error);
            return null;
        }
    } catch (error) {
        console.error("AQI Error:", error);
        return null;
    }
};
