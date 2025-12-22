import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth'; // Ensure this exists or use standard headers
import dbConnect from '@/lib/db';
import Address from '@/lib/models/UserAddress'; // Corrected import

export async function POST(req) {
    try {
        const session = await getSession();
        // If no session, maybe allowing guest? But usually protected.
        // For now, assuming session required or handled.

        const body = await req.json();
        const { label, address, fullAddress, landmark, flatNo, lat, lng, placeId } = body;

        await dbConnect();

        // If user is logged in, save to DB
        if (session && session.userId) {
            const newAddress = await Address.create({
                userId: session.userId,
                label,
                fullAddress, // Ensure schema matches
                landmark,
                flatNo,
                lat,
                lng,
                placeId
            });
            return NextResponse.json({ success: true, data: newAddress });
        }

        // If guest (or auth handled differently), usually we return success so frontend can store in local state
        // But the prompt implies storing in DB.
        // If no auth, return error or mock success?
        // Prompt says "Fix location not saving... Store location in Database (server action)".
        // If session is missing, we can't store in DB for user.
        // Let's assume auth is working or return 401.
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

    } catch (error) {
        console.error("Address API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
