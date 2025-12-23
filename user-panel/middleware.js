import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY || "sehat_fallback_secret_key";
const key = new TextEncoder().encode(secretKey);

export async function middleware(request) {
    const session = request.cookies.get('session');

    // Public paths that manage their own access or are open
    // Login, Onboarding, Static assets, API
    const isPublicPath = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname === '/';

    // Onboarding path
    const isOnboardingPath = request.nextUrl.pathname.startsWith('/onboarding');

    // Debug Middleware
    console.log(`Middleware Checking: ${request.nextUrl.pathname}`);
    request.cookies.getAll().forEach(c => console.log(`Cookie: ${c.name}=${c.value.substring(0, 10)}...`));

    if (!session) {
        // If no session and trying to access protected route -> Redirect to Login
        if (!isPublicPath && !isOnboardingPath) {
            console.log("Redirecting to login (No Session)");
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    try {
        // Verify Session
        const { payload } = await jwtVerify(session.value, key, {
            algorithms: ['HS256'],
        });

        // 1. If Profile Incomplete -> Force Onboarding
        // Condition: isProfileComplete is false AND user is NOT already on onboarding
        if (!payload.isProfileComplete && !isOnboardingPath) {
            return NextResponse.redirect(new URL('/onboarding/basic-details', request.url));
        }

        // 2. If Profile Complete -> Block Onboarding access (optional, good UX)
        if (payload.isProfileComplete && isOnboardingPath) {
            return NextResponse.redirect(new URL('/home', request.url));
        }

        // 3. If Profile Complete -> Block Login access
        if (request.nextUrl.pathname.startsWith('/login')) {
            return NextResponse.redirect(new URL('/home', request.url));
        }

        return NextResponse.next();

    } catch (error) {
        console.error("Middleware Session Verification Failed:", error.message);
        // Invalid Token -> Redirect to Login & Clear Cookie
        if (!isPublicPath) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('session');
            return response;
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder files (common extensions)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
