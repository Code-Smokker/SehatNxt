import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // Ensure this exists or use standard headers
import dbConnect from '@/lib/db';
import Address from '@/lib/models/UserAddress'; // Corrected import

import { auth } from '@clerk/nextjs/server';

export async function POST(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized: No active session' }, { status: 401 });
        }

        const body = await req.json();
        const { label, address, fullAddress, landmark, flatNo, lat, lng, placeId } = body;

        await dbConnect();

        const newAddress = await Address.create({
            userId,
            label,
            fullAddress,
            landmark,
            flatNo,
            lat,
            lng,
            placeId
        });
        return NextResponse.json({ success: true, data: newAddress });

    } catch (error) {
        console.error("Address API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
