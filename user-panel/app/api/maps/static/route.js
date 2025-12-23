import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return new NextResponse('Missing lat/lng', { status: 400 });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error("Google Maps API Key Missing");
            return new NextResponse('Server Configuration Error', { status: 500 });
        }

        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=16&size=600x300&scale=2&markers=color:red%7C${lat},${lng}&key=${apiKey}`;

        const response = await axios.get(url, {
            responseType: 'arraybuffer'
        });

        const buffer = Buffer.from(response.data);

        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'image/png',
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error("Static Map Proxy Error:", error.message);
        return new NextResponse('Failed to fetch map', { status: 500 });
    }
}
