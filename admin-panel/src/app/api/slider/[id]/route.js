import connectDB from '@/lib/db';
import Slider from '@/models/Slider';
import { NextResponse } from 'next/server';

export async function PUT(req, { params }) {
    try {
        await connectDB();
        const id = params.id;
        const body = await req.json();
        const slide = await Slider.findByIdAndUpdate(id, body, { new: true, runValidators: true });

        if (!slide) {
            return NextResponse.json({ success: false, message: 'Slide not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: slide });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectDB();
        const id = params.id;
        const slide = await Slider.findByIdAndDelete(id);

        if (!slide) {
            return NextResponse.json({ success: false, message: 'Slide not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Slide deleted' });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
