"use server";

import axios from 'axios';
import { auth } from '@clerk/nextjs/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api';

const getAuthHeader = async () => {
    const { userId, getToken } = await auth();
    const token = await getToken();
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

export async function saveDoctor(doctorId) {
    try {
        const config = await getAuthHeader();
        const res = await axios.post(`${API_BASE_URL}/my-doctors/save`, { doctorId }, config);
        return res.data;
    } catch (error) {
        console.error("Error saving doctor:", error?.response?.data || error.message);
        return { success: false, message: error?.response?.data?.message || "Failed to save doctor" };
    }
}

export async function removeDoctor(doctorId) {
    try {
        const config = await getAuthHeader();
        const res = await axios.delete(`${API_BASE_URL}/my-doctors/remove/${doctorId}`, config);
        return res.data;
    } catch (error) {
        console.error("Error removing doctor:", error?.response?.data || error.message);
        return { success: false, message: error?.response?.data?.message || "Failed to remove doctor" };
    }
}

export async function getSavedDoctors() {
    try {
        const config = await getAuthHeader();
        const res = await axios.get(`${API_BASE_URL}/my-doctors`, config);
        if (res.data.success) {
            return res.data.doctors || [];
        }
        return [];
    } catch (error) {
        console.error("Error fetching saved doctors:", error?.response?.data || error.message);
        return [];
    }
}

export async function checkIsDoctorSaved(doctorId) {
    try {
        const config = await getAuthHeader();
        const res = await axios.get(`${API_BASE_URL}/my-doctors/check/${doctorId}`, config);
        return res.data.saved;
    } catch (error) {
        // Silently fail for check
        return false;
    }
}
