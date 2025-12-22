"use server";

import axios from 'axios';
import { getSession } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export async function getMyPrescriptions() {
    const session = await getSession();
    if (!session) return [];

    try {
        // Fetch from backend using patient ID from session
        const res = await axios.get(`${API_BASE_URL}/prescriptions/patient/${session.id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching prescriptions:", error.message);
        return [];
    }
}
