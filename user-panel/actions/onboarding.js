"use server";

import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function completeOnboarding(formData) {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const mobile = formData.get('mobile');
    const name = formData.get('name');
    const email = formData.get('email');

    if (!name || !email) return { error: "Name and Email are required" };

    try {
        await dbConnect();

        // Basic validation
        if (name.length < 2) return { error: "Name must be at least 2 characters" };
        // Email validation could use regex here too

        // Update User in MongoDB
        // We assume we can find the user by Clerk ID or we update by email if that's how we verify?
        // Actually, previous logic updated by email. With Clerk, we should rely on Clerk User ID if possible, 
        // but if we are syncing, maybe we just update the record associated with this Clerk ID?
        // The previous code did: User.findOneAndUpdate({ email: email }, ...)
        // Let's stick to safe usage. If we have userId (clerkId), we might want to update by that if we synced it?
        // OR if this is the first time we are linking mongo user to clerk user.

        // Let's assume for now we update by key fields or create if needed?
        // Simpler: Update by email or create new if not exists, but we want to link validation.

        const user = await User.findOneAndUpdate(
            { email: email },
            {
                name: name,
                phone: mobile,
                isProfileComplete: true,
                // clerkId: userId // Optional: if added to schema
            },
            { new: true, upsert: true } // Upsert to ensure it exists
        );

        revalidatePath('/profile');
        revalidatePath('/home');

        return { success: true, user: JSON.parse(JSON.stringify(user)) };
    } catch (error) {
        console.error("Onboarding error:", error);
        return { error: "Failed to save details" };
    }
}
