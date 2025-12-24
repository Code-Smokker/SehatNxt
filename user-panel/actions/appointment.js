"use server";

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

const API_Base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

export async function bookAppointment(appointmentData) {
    const { userId, getToken } = await auth();
    const token = await getToken();

    if (!userId || !token) {
        return { error: 'Unauthorized: No active session' };
    }

    try {
        console.log(`[BookAppointment] URL: ${API_Base}/appointments/create`);
        console.log(`[BookAppointment] User: ${userId}`);

        const response = await fetch(`${API_Base}/appointments/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId, // Pass Clerk User ID
                ...appointmentData
            })
        });

        console.log("Booking Response Status:", response.status);
        const text = await response.text();
        // console.log("Booking Response Text:", text); // Verbose

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
    const { userId, getToken } = await auth();
    const token = await getToken();

    if (!userId || !token) {
        return [];
    }

    try {
        // Backend expects Clerk User ID to fetch appointments
        const response = await fetch(`${API_Base}/appointments/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.warn("API Fetch Failed", response.status, response.statusText);
            return [];
        }

        const appointments = await response.json();
        return JSON.parse(JSON.stringify(appointments));
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}
