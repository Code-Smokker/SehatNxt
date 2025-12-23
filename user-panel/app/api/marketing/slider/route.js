import dbConnect from '@/lib/db';
import Slider from '@/lib/models/Slider';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        await dbConnect();

        // Check if query params ask for active slides
        const { searchParams } = new URL(req.url);
        const isActive = searchParams.get('active');

        let query = {};
        if (isActive === 'true') {
            query.isActive = true;
        }

        const slides = await Slider.find(query).sort({ order: 1, createdAt: -1 });

        return NextResponse.json({ success: true, data: slides });
    } catch (error) {
        console.error("Marketing Slider API Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
