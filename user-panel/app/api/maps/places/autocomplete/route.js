import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const input = searchParams.get('input');

        if (!input) {
            return NextResponse.json({ predictions: [] });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY;
        // Use 'place/autocomplete' for search
        const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&types=(regions)`;

        const response = await axios.get(url);
        return NextResponse.json(response.data);

    } catch (error) {
        console.error("Places Autocomplete Error", error);
        return NextResponse.json({ error: 'Autocomplete failed' }, { status: 500 });
    }
}
