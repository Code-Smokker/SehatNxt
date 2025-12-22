import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

const secretKey = "sehatsupersecretkey123";
const key = new TextEncoder().encode(secretKey);

export async function getSession() {
    const cookieStore = cookies();
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

    cookies().set('session', token, {
        httpOnly: true,
        secure: true,
        expires,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession() {
    cookies().delete('session');
}

export async function updateSession(request) {
    return;
}
