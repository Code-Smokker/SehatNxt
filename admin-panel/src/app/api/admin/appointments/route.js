import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import Doctor from '@/models/Doctor';

export async function GET() {
    try {
        await dbConnect();
        // Ensure models are registered
        // Mongoose might not have registered 'User' or 'Doctor' if we rarely access them in this route separately, 
        // but importing them executes the model definition.

        const appointments = await Appointment.find({})
            .populate('patientId', 'name image')
            .populate('doctorId', 'name image speciality')
            .sort({ date: -1 });

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
