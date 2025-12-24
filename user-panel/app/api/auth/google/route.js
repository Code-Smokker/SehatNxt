import { OAuth2Client } from 'google-auth-library';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Use NEXT_PUBLIC_GOOGLE_CLIENT_ID if GOOGLE_CLIENT_ID is missing (common in Next.js setups)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const secretKey = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || "sehat_fallback_secret_key";
const key = new TextEncoder().encode(secretKey);

export async function POST(req) {
    try {
        const { credential } = await req.json();

        // 1. Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        await dbConnect();

        // 2. Check or Create User
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                image: picture,
                googleId,
                authProvider: 'google',
                role: 'patient',
                isProfileComplete: false
            });
        } else {
            // Link Google ID if existing email user logs in via Google
            if (!user.googleId) {
                user.googleId = googleId;
                if (user.authProvider === 'email') user.authProvider = 'google'; // or hybrid
                await user.save();
            }
        }

        // 3. Create Session
        const token = await new SignJWT({
            id: user._id.toString(),
            role: user.role,
            isProfileComplete: user.isProfileComplete
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(key);

        // 4. Set Cookie
        const cookieStore = await cookies();
        cookieStore.set('session', token, {
            httpOnly: true,
            secure: false, // Force false for localhost debugging
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            sameSite: 'lax',
            path: '/',
        });

        // 5. Respond
        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                phone: user.phone,
                role: user.role,
                isProfileComplete: user.isProfileComplete
            }
        });

    } catch (error) {
        console.error("Google Auth Error Details:", error);

        // Detailed Debug Logging
        if (!process.env.MONGODB_URI) console.error("CRITICAL: MONGODB_URI is undefined!");
        if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) console.error("CRITICAL: NEXT_PUBLIC_GOOGLE_CLIENT_ID is undefined!");

        return NextResponse.json({
            success: false,
            error: "Authentication failed",
            debug: error.message
        }, { status: 401 });
    }
}
