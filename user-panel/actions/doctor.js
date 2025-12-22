"use server";

import dbConnect from '@/lib/db';
import Appointment from '@/lib/models/Appointment';
import { mockDoctors } from '@/data/mockDoctors'; // Fallback / Source of Truth for details
import { getSession } from '@/lib/auth';

export async function getMyDoctors() {
    const session = await getSession();
    if (!session) return [];

    try {
        await dbConnect();

        // Find all appointments for user to get list of doctor IDs
        const appointments = await Appointment.find({ userId: session.userId }).select('doctorId').lean();
        const doctorIds = [...new Set(appointments.map(a => a.doctorId))];

        // In a real app with Doctor Collection, we would do: Doctor.find({ _id: { $in: doctorIds } })
        // Here we filter mockDoctors
        const doctors = mockDoctors.filter(d => doctorIds.includes(d.id.toString()) || doctorIds.includes(parseInt(d.id)));

        // If no appointments, maybe return none? 
        // Or for demo purposes return random few if empty?
        // Let's return actual.
        return doctors;

    } catch (error) {
        console.error("Error fetching my doctors:", error);
        return [];
    }
}
