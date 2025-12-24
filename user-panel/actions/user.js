"use server";

import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function getUserProfile() {
    const { userId } = await auth();
    if (!userId) return null;

    try {
        await dbConnect();
        const user = await User.findById(userId).lean();
        if (!user) return null;

        // Return user data, flattened
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updateUserProfile(data) {
    const { userId } = await auth();
    if (!userId) return { error: 'Unauthorized' };

    try {
        await dbConnect();

        console.log("updateUserProfile RECEIVED:", data); // DEBUG LOG

        // Filter out empty strings/nulls to avoid overwriting existing data
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== null && v !== "" && v !== undefined)
        );

        console.log("updateUserProfile CLEANED:", cleanData); // DEBUG LOG

        // Update user and return new document
        const updatedUser = await User.findByIdAndUpdate(
            session.userId,
            { $set: cleanData },
            { new: true }
        ).lean();

        console.log("updateUserProfile SAVED:", updatedUser); // DEBUG LOG

        revalidatePath('/profile');

        // Return full updated user
        return {
            success: true,
            user: JSON.parse(JSON.stringify(updatedUser))
        };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: 'Failed to update profile' };
    }
}
