import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const placeId = searchParams.get('placeId');

        if (!placeId) {
            return NextResponse.json({ error: 'Place ID required' });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry,formatted_address,name,address_components&key=${apiKey}`;

        const response = await axios.get(url);
        return NextResponse.json(response.data);

    } catch (error) {
        console.error("Place Details Error", error);
        return NextResponse.json({ error: 'Details failed' }, { status: 500 });
    }
}
