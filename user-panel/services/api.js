import { getSession } from '@/lib/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

const api = {
    // --- AUTH HEADERS ---
    async getHeaders() {
        const session = await getSession();
        return {
            'Content-Type': 'application/json',
            ...(session?.token ? { 'Authorization': `Bearer ${session.token}` } : {})
        };
    },

    // --- GENERIC GET ---
    async get(endpoint) {
        try {
            const headers = await this.getHeaders();
            const res = await fetch(`${API_BASE}${endpoint}`, { headers, cache: 'no-store' });
            if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
            return await res.json();
        } catch (error) {
            console.error(`GET ${endpoint} failed:`, error);
            return null;
        }
    },

    // --- GENERIC POST ---
    async post(endpoint, body) {
        try {
            const headers = await this.getHeaders();
            const res = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            const data = await res.json();
            return { success: res.ok, data, error: !res.ok ? (data.message || 'Request failed') : null };
        } catch (error) {
            console.error(`POST ${endpoint} failed:`, error);
            return { success: false, error: error.message };
        }
    }
};

export default api;
