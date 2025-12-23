import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/auth/doctor';

export const authService = {
    // 1. Send OTP
    sendOtp: async (phone) => {
        try {
            const response = await axios.post(`${API_URL}/send-otp`, { phone });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to send OTP';
        }
    },

    // 2. Verify OTP
    verifyOtp: async (phone, otp) => {
        try {
            const response = await axios.post(`${API_URL}/verify-otp`, { phone, otp });
            return response.data; // Returns { token, doctor... }
        } catch (error) {
            throw error.response?.data?.message || 'Invalid OTP';
        }
    },

    // 3. Update Profile (Onboarding)
    updateProfile: async (id, data) => {
        try {
            const response = await axios.patch(`${API_URL}/profile/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Update failed';
        }
    }
};
