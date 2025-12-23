"use server";

import { createSession, deleteSession } from '@/lib/auth';
import dbConnect from '@/lib/db';
import User from '@/lib/models/User';
import Otp from '@/lib/models/Otp';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// 10: export async function sendOtp(formData) {
export async function sendOtp(formData) {
    const mobile = formData.get('mobile');

    // Validate mobile
    if (!mobile || mobile.length !== 10) {
        return JSON.parse(JSON.stringify({ error: 'Invalid mobile number' }));
    }

    // DEMO MODE CHECK
    if (process.env.OTP_MODE === 'demo') {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        console.log(`\n================================`);
        console.log(`[DEMO OTP] for ${mobile} => ${otpCode}`);
        console.log(`================================\n`);

        // Simple cookie-based storage for demo (insecure for prod, fine for demo)
        // Note: In server actions, we can't easily set cookies without 'next/headers'
        // But we can try to rely on client-side handling or just DB bypass?
        // Wait, "Ensure stateless verification (cookie or similar)".

        // Actually, importing cookies() from 'next/headers' is standard in server actions.
        const { cookies } = await import('next/headers');
        (await cookies()).set('demo_otp', JSON.stringify({ mobile, otp: otpCode }), { maxAge: 600 }); // 10 mins

        return JSON.parse(JSON.stringify({ success: true, message: 'OTP sent successfully (DEMO)' }));
    }

    try {
        await dbConnect();

        // 1. Generate Random 6-digit OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

        // 2. Store in DB (upsert/replace old one)
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins from now
        await Otp.deleteMany({ phone: mobile });
        await Otp.create({
            phone: mobile,
            otp: otpCode,
            expiresAt: expiresAt
        });

        // 3. Send OTP (Simulated via Console)
        console.log(`\n================================`);
        console.log(`[AUTH] Sending OTP to ${mobile}`);
        console.log(`[AUTH] CODE: ${otpCode}`);
        console.log(`================================\n`);

        return JSON.parse(JSON.stringify({ success: true, message: 'OTP sent successfully' }));
    } catch (error) {
        console.error("Send OTP Error:", error);
        return JSON.parse(JSON.stringify({ error: `Failed to send OTP: ${error.message}` }));
    }
}

export async function verifyOtp(prevState, formData) {
    const mobile = formData.get('mobile');
    const otp = formData.get('otp');

    if (!mobile || !otp) {
        return JSON.parse(JSON.stringify({ error: 'Missing mobile or OTP' }));
    }

    try {
        await dbConnect();

        // DEMO MODE CHECK
        if (process.env.OTP_MODE === 'demo') {
            const { cookies } = await import('next/headers');
            const demoCookie = (await cookies()).get('demo_otp');

            let isValid = false;
            if (demoCookie) {
                try {
                    const data = JSON.parse(demoCookie.value);
                    if (data.mobile === mobile && data.otp === otp) {
                        isValid = true;
                    }
                } catch (e) { }
            }

            if (!isValid) {
                // Allow magic OTP "123456" for convenience if desired, OR strict check?
                // User asked: "Compare input OTP with generated OTP". 
                // So strict check against what was logged.
                return JSON.parse(JSON.stringify({ error: 'Invalid or Expired OTP (Demo)' }));
            }

            // Clear cookie
            (await cookies()).delete('demo_otp');
        } else {
            // 1. Verify OTP against Database
            const otpRecord = await Otp.findOne({ phone: mobile, otp });

            if (!otpRecord) {
                return JSON.parse(JSON.stringify({ error: 'Invalid or Expired OTP' }));
            }

            // 2. Clear OTP after usage
            await Otp.deleteMany({ phone: mobile });
        }

        // 3. Check if user exists or Create New
        let user = await User.findOne({ phone: mobile });
        let isNewUser = false;

        if (!user) {
            user = await User.create({
                phone: mobile,
                name: "New User",
                role: "patient",
                email: `${mobile}@sehatnxt.com`, // Dummy email
                password: "$2a$10$DUMMYHASHFOROTPUSER...................",
                createdAt: new Date()
            });
            isNewUser = true;
        }

        // 5. Determine redirect path
        const isProfileComplete = user.name && user.name !== "New User" &&
            user.email && !user.email.endsWith("@sehatnxt.com");

        // 4. Create Session (MOVED AFTER CHECK)
        await createSession(user._id.toString(), user.role, isProfileComplete);

        if (!isProfileComplete) {
            return JSON.parse(JSON.stringify({
                success: true,
                requiresOnboarding: true,
                redirectUrl: '/onboarding/basic-details',
                user: { name: user.name, phone: user.phone, role: user.role, email: user.email }
            }));
        } else {
            return JSON.parse(JSON.stringify({
                success: true,
                requiresOnboarding: false,
                redirectUrl: '/home',
                user: { name: user.name, phone: user.phone, role: user.role, email: user.email }
            }));
        }

    } catch (error) {
        console.error("Login verification error:", error);
        return JSON.parse(JSON.stringify({ error: 'Internal Server Error' }));
    }
}

export async function completeOnboarding(formData) {
    const mobile = formData.get('mobile');
    const name = formData.get('name');
    const email = formData.get('email');

    if (!mobile || !name || !email) return JSON.parse(JSON.stringify({ error: "Name and Email are required" }));

    try {
        await dbConnect();

        // Basic validation
        if (name.length < 2) return JSON.parse(JSON.stringify({ error: "Name must be at least 2 characters" }));
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return JSON.parse(JSON.stringify({ error: "Invalid email format" }));

        // For Google Auth users, we might be setting the phone for the first time.
        // So we should find by EMAIL (which is constant), not phone.
        const user = await User.findOneAndUpdate(
            { email: email },
            { name: name, phone: mobile, isProfileComplete: true },
            { new: true }
        );

        if (!user) return JSON.parse(JSON.stringify({ error: "User not found" }));

        // Update Session to reflect completed profile
        await createSession(user._id.toString(), user.role, true);

        // Revalidate all paths to ensure global update
        revalidatePath('/', 'layout');
        revalidatePath('/home');
        revalidatePath('/profile');

        return JSON.parse(JSON.stringify({ success: true, user: { name: user.name, phone: user.phone, role: user.role, email: user.email } }));
    } catch (error) {
        console.error("Onboarding error:", error);
        if (error.code === 11000) return JSON.parse(JSON.stringify({ error: "Email already in use" }));
        return JSON.parse(JSON.stringify({ error: "Failed to save details" }));
    }
}

// Backward compatibility wrapper
export async function updateProfile(formData) {
    return await completeOnboarding(formData);
}

export async function logout() {
    await deleteSession();
    redirect('/login');
}
