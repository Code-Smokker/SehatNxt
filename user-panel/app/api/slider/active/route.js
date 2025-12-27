import dbConnect from '@/lib/db';
import Slider from '@/lib/models/Slider'; // Ensure path matches where I created it
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await dbConnect();
        const slides = await Slider.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        // Return raw array to match what User Panel front end might expect or standard format
        // Backend (Express) returned { success: true, count, data } or just array in older version.
        // Frontend OfferSlider checks `res.data.data` or `res.data`.
        // I'll return strict standard:
        return NextResponse.json({ success: true, data: slides });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
