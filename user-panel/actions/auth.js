"use server";

import { createSession, deleteSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Otp from '@/lib/models/Otp';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function sendOtp(formData) {
    const mobile = formData.get('mobile');

    // Validate mobile
    if (!mobile || mobile.length !== 10) {
        return { error: 'Invalid mobile number' };
    }

    try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

        const response = await fetch(`${API_BASE}/auth/send-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: mobile })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send OTP');
        }

        return { success: true, message: data.message };
    } catch (error) {
        console.error("Send OTP Action Error:", error);
        return { error: error.message };
    }
}

export async function verifyOtp(prevState, formData) {
    const mobile = formData.get('mobile');
    const otp = formData.get('otp');

    if (!mobile || !otp) {
        return { error: 'Missing mobile or OTP' };
    }

    try {
        await dbConnect();

        // 1. Verify OTP against Database (Direct Access)
        const otpRecord = await Otp.findOne({ phone: mobile, otp });

        if (!otpRecord) {
            return { error: 'Invalid or Expired OTP' };
        }

        // 2. Clear OTP after usage
        await Otp.deleteMany({ phone: mobile });

        // OTP Verified Successfully. Now handle User Login/Signup locally (as this is the Auth Server Action)

        // 3. Check if user exists or Create New
        let user = await User.findOne({ phone: mobile });
        let isNewUser = false;

        if (!user) {
            user = await User.create({
                phone: mobile,
                name: "New User",
                role: "patient",
                email: `${mobile}@sehatnxt.com`, // Dummy email
                password: "$2a$10$DUMMYHASHFOROTPUSER...................",
                createdAt: new Date()
            });
            isNewUser = true;
        }

        // 5. Determine redirect path
        const isProfileComplete = user.name && user.name !== "New User" &&
            user.email && !user.email.endsWith("@sehatnxt.com");

        // 4. Create Session (MOVED AFTER CHECK)
        await createSession(user._id.toString(), user.role, isProfileComplete);

        if (!isProfileComplete) {
            return {
                success: true,
                requiresOnboarding: true,
                redirectUrl: '/onboarding/basic-details',
                user: { name: user.name, phone: user.phone, role: user.role, email: user.email }
            };
        } else {
            return {
                success: true,
                requiresOnboarding: false,
                redirectUrl: '/home',
                user: { name: user.name, phone: user.phone, role: user.role, email: user.email }
            };
        }

    } catch (error) {
        console.error("Login verification error:", error);
        return { error: 'Internal Server Error' };
    }
}

export async function completeOnboarding(formData) {
    const mobile = formData.get('mobile');
    const name = formData.get('name');
    const email = formData.get('email');

    if (!mobile || !name || !email) return { error: "Name and Email are required" };

    try {
        await dbConnect();

        // Basic validation
        if (name.length < 2) return { error: "Name must be at least 2 characters" };
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return { error: "Invalid email format" };

        const user = await User.findOneAndUpdate(
            { phone: mobile },
            { name: name, email: email },
            { new: true }
        );

        if (!user) return { error: "User not found" };

        // Update Session to reflect completed profile
        await createSession(user._id.toString(), user.role, true);

        // Revalidate all paths to ensure global update
        revalidatePath('/', 'layout');
        revalidatePath('/home');
        revalidatePath('/profile');

        return { success: true, user: { name: user.name, phone: user.phone, role: user.role, email: user.email } };
    } catch (error) {
        console.error("Onboarding error:", error);
        if (error.code === 11000) return { error: "Email already in use" };
        return { error: "Failed to save details" };
    }
}

// Backward compatibility wrapper
export async function updateProfile(formData) {
    return await completeOnboarding(formData);
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
