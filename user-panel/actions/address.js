"use server";

import dbConnect from '@/lib/db';
import UserAddress from '@/lib/models/UserAddress';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Mock function until actual geocoding is set up in a utility if needed server-side, 
// but mostly geocoding happens client-side in this flow.

// 1. Add Address
export async function addUserAddress(data) {
    try {
        const session = await getSession();
        if (!session) return { error: "Unauthorized" };

        await dbConnect();

        const newAddress = await UserAddress.create({
            userId: session.userId,
            label: data.label,
            address: data.address,
            landmark: data.landmark || "",
            lat: data.lat,
            lng: data.lng
        });

        // Revalidate if we had a page showing list
        // revalidatePath('/profile'); 

        return { success: true, address: JSON.parse(JSON.stringify(newAddress)) };
    } catch (error) {
        console.error("Add Address Error:", error);
        return { error: error.message };
    }
}

// 2. Get All Addresses
export async function getUserAddresses() {
    try {
        const session = await getSession();
        if (!session) return [];

        await dbConnect();

        const addresses = await UserAddress.find({ userId: session.userId }).sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(addresses));
    } catch (error) {
        console.error("Get Addresses Error:", error);
        return [];
    }
}

// 3. Delete Address
export async function deleteUserAddress(addressId) {
    try {
        const session = await getSession();
        if (!session) return { error: "Unauthorized" };

        await dbConnect();

        await UserAddress.findOneAndDelete({ _id: addressId, userId: session.userId });

        return { success: true };
    } catch (error) {
        console.error("Delete Address Error:", error);
        return { error: error.message };
    }
}
