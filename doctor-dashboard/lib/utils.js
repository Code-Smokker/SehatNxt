import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('doctor_token', token);
        document.cookie = `doctor_token=${token}; path=/; max-age=86400`; // 1 day
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('doctor_token');
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('doctor_token');
        document.cookie = 'doctor_token=; path=/; max-age=0';
    }
};
