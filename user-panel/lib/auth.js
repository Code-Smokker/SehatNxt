"use server";

import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || "sehat_fallback_secret_key";
console.log("Auth Lib using secret:", secretKey ? secretKey.substring(0, 5) + "..." : "MISSING", "Source:", process.env.JWT_SECRET ? "JWT_SECRET" : (process.env.JWT_SECRET_KEY ? "JWT_SECRET_KEY" : "FALLBACK"));

const key = new TextEncoder().encode(secretKey);

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    if (!session) return null;
    try {
        const { payload } = await jwtVerify(session.value, key, {
            algorithms: ['HS256'],
        });
        return { ...payload, userId: payload.id, token: session.value };
    } catch (e) {
        return null;
    }
}

export async function createSession(userId, role, isProfileComplete = false) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    const token = await new SignJWT({ id: userId, role, isProfileComplete })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);

    (await cookies()).set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    (await cookies()).delete('session');
}

export async function updateSession(request) {
    return;
}
