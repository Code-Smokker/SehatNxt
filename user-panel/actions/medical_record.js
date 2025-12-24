"use server";

import dbConnect from '@/lib/db';
import MedicalRecord from '@/lib/models/MedicalRecord';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// ... (imports)

export async function uploadMedicalRecord(formData) {
    const { userId } = await auth();
    if (!userId) return { error: 'Unauthorized' };

    const file = formData.get('file');
    const title = formData.get('title') || file.name;

    if (!file) return { error: 'No file provided' };

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        // Clean filename and make unique
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.name);
        const filename = `${file.name.replace(/\.[^/.]+$/, "")}-${uniqueSuffix}${ext}`;

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'medical-records');
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/medical-records/${filename}`;

        // Save to DB
        await dbConnect();
        await MedicalRecord.create({
            userId: session.userId,
            title,
            type: 'Prescription', // Default to valid enum
            fileUrl: fileUrl,
            uploadedAt: new Date()
        });

        revalidatePath('/medical-records');
        return { success: true };

    } catch (error) {
        console.error("Error uploading record:", error);
        return { error: 'Failed to upload record' };
    }
}

export async function getMedicalRecords() {
    const { userId } = await auth();
    if (!userId) return [];

    try {
        await dbConnect();
        const records = await MedicalRecord.find({ userId: session.userId }).sort({ uploadedAt: -1 });
        // Serialization for client component
        return JSON.parse(JSON.stringify(records));
    } catch (error) {
        console.error("Error fetching records:", error);
        return [];
    }
}
