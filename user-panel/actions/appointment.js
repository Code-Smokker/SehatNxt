"use server";

import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const API_Base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function bookAppointment(appointmentData) {
    const session = await getSession();
    if (!session) {
        return { error: 'Unauthorized' };
    }

    try {
        console.log(`[BookAppointment] URL: ${API_Base}/appointments/create`);
        console.log(`[BookAppointment] Token: ${session.token ? session.token.substring(0, 10) + '...' : 'MISSING'}`);

        const response = await fetch(`${API_Base}/appointments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.token || ''}` // Assuming session might have a token later
            },
            body: JSON.stringify({
                userId: session.userId,
                ...appointmentData
            })
        });

        console.log("Booking Response Status:", response.status);
        const text = await response.text();
        console.log("Booking Response Text:", text);

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`Server responded with ${response.status}: ${text.substring(0, 50)}...`);
        }

        if (!response.ok) {
            throw new Error(data.message || 'Booking failed');
        }

        revalidatePath('/appointments');
        return JSON.parse(JSON.stringify({ success: true, appointment: data }));
    } catch (error) {
        console.error("Booking Error:", error);
        return { error: error.message || 'Failed to book appointment' };
    }
}

export async function getMyAppointments() {
    const session = await getSession();
    if (!session) {
        return [];
    }

    try {
        const response = await fetch(`${API_Base}/appointments/user/${session.userId}`, {
            headers: {
                'Authorization': `Bearer ${session.token || ''}`
            }
        });

        if (!response.ok) {
            // Fallback for now if API fails or backend not running, to prevent crash
            console.warn("API Fetch Failed", response.statusText);
            return [];
        }

        const appointments = await response.json();
        return JSON.parse(JSON.stringify(appointments));
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}
