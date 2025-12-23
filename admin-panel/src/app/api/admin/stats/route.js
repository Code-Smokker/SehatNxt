import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Doctor from '@/models/Doctor';
import User from '@/models/User';
import Appointment from '@/models/Appointment';

export async function GET() {
    try {
        await dbConnect();

        const doctorsTotal = await Doctor.countDocuments({});
        const doctorsActive = await Doctor.countDocuments({ isActive: true });
        const usersTotal = await User.countDocuments({ role: 'patient' }); // specific to patients usually
        const appointmentsTotal = await Appointment.countDocuments({});

        // New Registrations Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const usersNew = await User.countDocuments({ createdAt: { $gte: startOfDay } });

        return NextResponse.json({
            doctorsTotal,
            doctorsActive,
            usersTotal,
            usersNew,
            appointmentsTotal
        });
    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}
