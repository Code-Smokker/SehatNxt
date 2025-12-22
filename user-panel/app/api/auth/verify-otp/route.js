import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Otp from '@/lib/models/Otp';

export async function POST(req) {
    try {
        const { phone, otp } = await req.json();

        if (!phone || !otp) {
            return NextResponse.json({ message: 'Phone and OTP are required' }, { status: 400 });
        }

        await dbConnect();

        const otpRecord = await Otp.findOne({ phone });

        if (!otpRecord) {
            return NextResponse.json({ message: 'OTP not found or expired' }, { status: 400 });
        }

        if (String(otpRecord.otp) !== String(otp)) {
            return NextResponse.json({ message: 'Invalid OTP' }, { status: 400 });
        }

        // Verify Expiry (Safety check, though Mongo TTL handles it eventually)
        if (new Date(otpRecord.expiresAt) < new Date()) {
            await Otp.deleteOne({ _id: otpRecord._id });
            return NextResponse.json({ message: 'OTP has expired' }, { status: 400 });
        }

        // Clear OTP after success
        await Otp.deleteMany({ phone });

        return NextResponse.json({ success: true, message: 'OTP verified successfully' });

    } catch (error) {
        console.error("Verify OTP API Error:", error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
