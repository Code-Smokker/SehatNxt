import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    const cookieStore = await cookies();
    cookieStore.delete('session');

    // Also clear any other auth cookies if present
    cookieStore.delete('demo_otp');

    return NextResponse.json({ success: true, message: 'Logged out successfully' });
}
