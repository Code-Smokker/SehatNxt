import connectDB from '@/lib/db';
import Slider from '@/models/Slider';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await connectDB();
        const slides = await Slider.find({}).sort({ order: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: slides });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();

        if (!body.title || !body.imageUrl) {
            return NextResponse.json({ success: false, message: 'Title and Image URL are required' }, { status: 400 });
        }

        const slide = await Slider.create(body);
        return NextResponse.json({ success: true, data: slide }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
