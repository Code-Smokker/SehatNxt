import { NextResponse } from 'next/server';
import axios from 'axios';

// Simple in-memory cache (Production should use Redis/Vercel KV)
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function POST(req) {
    try {
        const body = await req.json();
        const { lat, lng } = body;

        if (!lat || !lng) {
            return NextResponse.json({ success: false, error: 'Location required' }, { status: 400 });
        }

        const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`; // Approximate caching
        const cached = cache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
            // console.log("Serving cached AQI");
            // return NextResponse.json({ success: true, data: cached.data, source: 'cache' });
        }

        const apiKey = process.env.GOOGLE_AQI_API_KEY || process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ success: false, error: 'API Key Missing' }, { status: 500 });
        }

        const url = `https://airquality.googleapis.com/v1/currentConditions:lookup?key=${apiKey}`;

        const response = await axios.post(url, {
            location: {
                latitude: parseFloat(lat),
                longitude: parseFloat(lng)
            },
            universalAqi: true,
            extraComputations: ["HEALTH_RECOMMENDATIONS", "DOMINANT_POLLUTANT_CONCENTRATION", "POLLUTANT_CONCENTRATION", "LOCAL_AQI"]
        });

        // Normalize Data
        const raw = response.data;
        // Typically Index 0 is Universal AQI or primary
        // But let's find 'uaqi' specifically or fallback to 0
        const indexData = raw.indexes?.find(i => i.code === 'uaqi') || raw.indexes?.[0];

        if (!indexData) {
            return NextResponse.json({ success: false, error: 'No AQI data found' });
        }

        const normalizedData = {
            aqi: indexData.aqi,
            category: indexData.category, // "Good", "Moderate" etc.
            displayName: indexData.displayName,
            healthAdvice: raw.healthRecommendations?.general || "No specific advice available.",
            dominantPollutant: raw.dominantPollutant,
            updatedAt: new Date().toISOString(),
            color: indexData.color
        };

        // Cache it (DISABLE FOR DEBUG)
        // cache.set(cacheKey, { timestamp: Date.now(), data: normalizedData });

        console.log("AQI Live Data:", JSON.stringify(normalizedData, null, 2));

        return NextResponse.json({ success: true, data: normalizedData });

    } catch (error) {
        console.error("AQI Proxy Error", error.message);
        return NextResponse.json({ success: false, error: 'Failed to fetch AQI' }, { status: 500 });
    }
}
