import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/models/Doctor';

export async function GET() {
    try {
        await dbConnect();
        const doctors = await Doctor.find({}).sort({ createdAt: -1 });
        return NextResponse.json(doctors);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req) {
    try {
        await dbConnect();
        const { id, isActive } = await req.json();
        const doctor = await Doctor.findByIdAndUpdate(id, { isActive }, { new: true });
        return NextResponse.json(doctor);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
