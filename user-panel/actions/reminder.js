"use server";

import dbConnect from '@/lib/db';
import Reminder from '@/lib/models/Reminder';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

export async function getReminders() {
    const { userId } = await auth();
    if (!userId) return [];

    try {
        await dbConnect();
        const reminders = await Reminder.find({ userId })
            .sort({ datetime: 1 })
            .lean();
        return JSON.parse(JSON.stringify(reminders));
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return [];
    }
}

export async function createReminder(data) {
    const { userId } = await auth();
    if (!userId) return { error: 'Unauthorized' };

    try {
        await dbConnect();
        await Reminder.create({
            userId,
            ...data,
            isActive: true,
            createdAt: new Date()
        });
        revalidatePath('/reminders');
        return { success: true };
    } catch (error) {
        console.error("Error creating reminder:", error);
        return { error: 'Failed to create reminder' };
    }
}

export async function deleteReminder(id) {
    const { userId } = await auth();
    if (!userId) return { error: 'Unauthorized' };

    try {
        await dbConnect();
        await Reminder.findOneAndDelete({ _id: id, userId: session.userId });
        revalidatePath('/reminders');
        return { success: true };
    } catch (error) {
        console.error("Error deleting reminder:", error);
        return { error: 'Failed to delete reminder' };
    }
}
