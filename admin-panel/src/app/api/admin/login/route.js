import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // Find user
        const user = await User.findOne({ email });
        console.log(`[LOGIN ATTEMPT] Email: ${email}, Found: ${!!user}, Role: ${user?.role}`);

        // Check existence and role
        if (!user || user.role !== 'admin') {
            console.log('[LOGIN FAILED] User not found or not admin');
            return NextResponse.json({ message: "Invalid credentials or not authorized" }, { status: 401 });
        }

        // Check password
        const isMatch = await user.matchPassword(password);
        console.log(`[LOGIN ATTEMPT] Password Match: ${isMatch}`);

        if (!isMatch) {
            console.log('[LOGIN FAILED] Password mismatch');
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Generate Token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        return NextResponse.json({
            token,
            admin: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
