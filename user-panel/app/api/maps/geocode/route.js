import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const lat = searchParams.get('lat');
        const lng = searchParams.get('lng');

        if (!lat || !lng) {
            return NextResponse.json({ error: 'Coordinates required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        const response = await axios.get(url);

        if (response.data.status === 'OK' && response.data.results.length > 0) {
            const result = response.data.results[0];
            const components = result.address_components;

            // Extract meaningful parts
            let locality = components.find(c => c.types.includes('locality'))?.long_name;
            let subLocality = components.find(c => c.types.includes('sublocality'))?.long_name;
            let city = components.find(c => c.types.includes('administrative_area_level_2'))?.long_name;
            let state = components.find(c => c.types.includes('administrative_area_level_1'))?.long_name;
            let country = components.find(c => c.types.includes('country'))?.long_name;

            // Fallbacks
            if (!locality && subLocality) locality = subLocality;
            if (!city) city = state;

            // Construct readable name
            let placeName = result.formatted_address; // Default
            if (locality && city) {
                placeName = `${locality}, ${city}`;
            } else if (locality && state) {
                placeName = `${locality}, ${state}`;
            }

            return NextResponse.json({
                success: true,
                address: placeName, // Friendly name
                fullAddress: result.formatted_address,
                raw: result
            });
        }

        return NextResponse.json({ success: false, error: 'No results found' });

    } catch (error) {
        console.error("Geocoding Error", error);
        return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
    }
}
