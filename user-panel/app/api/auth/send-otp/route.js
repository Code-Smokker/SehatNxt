import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Otp from '@/lib/models/Otp';
import axios from 'axios';

export async function POST(req) {
    try {
        const { phone } = await req.json();

        if (!phone || phone.length !== 10) {
            return NextResponse.json({ message: 'Valid 10-digit phone number is required' }, { status: 400 });
        }

        await dbConnect();

        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Save to DB (Upsert)
        await Otp.deleteMany({ phone }); // Clear old OTPs
        await Otp.create({
            phone,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 mins expiry
        });

        // 3. Send SMS via Fast2SMS
        const apiKey = process.env.FAST2SMS_API_KEY;

        if (!apiKey) {
            // Fallback for dev without key (prints to console)
            console.warn('[Fast2SMS] API Key missing. OTP Logged:', otp);
            if (process.env.NODE_ENV === 'development') {
                return NextResponse.json({
                    success: true,
                    message: "OTP Sent (Dev Mode - Check Console)",
                    devOtp: otp
                });
            }
            return NextResponse.json({ message: 'Server Configuration Error: Missing SMS Key' }, { status: 500 });
        }

        const smsResponse = await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            route: 'otp',
            variables_values: otp,
            numbers: phone,
            flash: 0
        }, {
            headers: { "authorization": apiKey }
        });

        console.log(`[Fast2SMS] Sent to ${phone}:`, smsResponse.data);

        return NextResponse.json({ success: true, message: 'OTP sent successfully' });

    } catch (error) {
        console.error("Send OTP API Error:", error);
        return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
