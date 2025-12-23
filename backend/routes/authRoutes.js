const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Otp = require('../models/Otp');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Helper
const generateReferralCode = (role) => {
    const prefix = role === 'doctor' ? 'SEHAT-DOC-' : 'SEHAT-USER-';
    const random = Math.random().toString(36).substring(2, 8).toUpperCase(); // 6 chars
    return prefix + random;
};
const Referral = require('../models/Referral');

// Register User
router.post('/register', async (req, res) => {
    const { name, email, password, referralCode } = req.body; // referralCode is likely 'referredBy' if coming from UI input
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newReferralCode = generateReferralCode('patient');

        const user = await User.create({
            name,
            email,
            password,
            referralCode: newReferralCode,
            referredBy: referralCode || null
        });

        // 🟢 HANDLE REFERRAL TRACKING
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                await Referral.create({
                    referrerId: referrer._id,
                    referrerRole: referrer.role,
                    refereeId: user._id,
                    refereeRole: 'patient',
                    status: 'pending' // Waits for admin
                });
            }
        }

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            referralCode: user.referralCode
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && !user.isActive) {
            return res.status(403).json({ message: 'Your account has been disabled. Please contact admin.' });
        }
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 1. Send OTP (Find or Create Doctor)
router.post('/doctor/send-otp', async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ message: "Phone number is required" });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save to Otp Collection (Upsert or Delete Old)
        await Otp.findOneAndDelete({ phone });
        await Otp.create({
            phone,
            otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins
        });

        console.log(`
================================
[AUTH] Sending OTP to ${phone}
[AUTH] CODE: ${otp}
================================ 
        `);

        res.status(200).json({
            message: "OTP sent successfully",
            otp: otp
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// 2. Verify OTP
router.post('/doctor/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;
        console.log(`[VERIFY DEBUG] Request: phone=${phone}, otp=${otp}`);

        if (!phone || !otp) {
            return res.status(400).json({ message: "Phone and OTP are required" });
        }

        // Find by phone first to debug better
        const otpRecord = await Otp.findOne({ phone });
        console.log(`[VERIFY DEBUG] Record found:`, otpRecord);

        if (!otpRecord) {
            console.log(`[VERIFY DEBUG] OTP not found for ${phone}`);
            return res.status(400).json({ message: "OTP not found or expired" });
        }

        // String comparison to prevent Type Mime Match
        if (String(otpRecord.otp) !== String(otp)) {
            console.log(`[VERIFY DEBUG] Mismatch: DB=${otpRecord.otp} Input=${otp}`);
            return res.status(400).json({ message: "Invalid OTP" });
        }

        // Expiry Check (Safety since Mongo TTL might have lag)
        if (new Date(otpRecord.expiresAt) < new Date()) {
            console.log(`[VERIFY DEBUG] Expired`);
            await Otp.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: "OTP has expired" });
        }

        // Clear OTP (Success)
        await Otp.deleteOne({ _id: otpRecord._id });

        // 3. Find or Create User (Login/Signup Logic)
        let user = await User.findOne({ phone });

        if (user && !user.isActive) {
            return res.status(403).json({ message: "Your account has been disabled. Please contact admin." });
        }

        if (!user) {
            console.log(`[AUTH] Creating new user for doctor ${phone}`);

            const newReferralCode = generateReferralCode('doctor'); // Use helper from above scope if available, need to ensure it's available or duplicated. 
            // Since it's inside same file but scope might be issue, I'll inline helper logic or ensure it's global.
            // Actually, I put the helper at top in invalid previous step? 
            // Wait, I replaced lines 14-26. The helper is defined there. This block is around line 133.
            // So the helper IS available in the file scope.

            user = await User.create({
                phone,
                name: "New Doctor",
                role: 'doctor',
                email: `${phone}@sehatnxt.com`,
                referralCode: newReferralCode
            });
        }

        // 4. Check if Doctor Profile Exists
        const doctor = await Doctor.findOne({ userId: user._id });

        const token = generateToken(user._id);

        res.json({
            token,
            userId: user._id,
            name: user.name,
            role: user.role,
            doctorId: doctor ? doctor._id : null,
            isProfileComplete: doctor ? doctor.isProfileComplete : false
        });

    } catch (error) {
        console.error("[VERIFY OTP ERROR]:", error);
        res.status(500).json({ message: "Internal Server Error during verification" });
    }
});

// Update Doctor Profile (Onboarding Steps)
router.patch('/doctor/profile/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Login Doctor
router.post('/doctor/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const doctor = await Doctor.findOne({ email });
        if (doctor && (await doctor.matchPassword(password))) {
            res.json({
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                token: generateToken(doctor._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
