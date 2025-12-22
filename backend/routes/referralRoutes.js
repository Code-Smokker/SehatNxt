const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Referral = require('../models/Referral');

// Helper to generate unique referral code
const generateReferralCode = (role) => {
    const prefix = role === 'doctor' ? 'SEHAT-DOC-' : 'SEHAT-USER-';
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return prefix + random;
};

// 🟢 GET MY WALLET & REFERRALS (User/Doctor)
router.get('/my', async (req, res) => {
    try {
        const userId = req.headers['user-id'] || req.query.userId;
        const role = req.query.role || 'user'; // 'user' or 'doctor'

        if (!userId || userId === 'null' || userId === 'undefined') {
            return res.json({ referralCode: '', wallet: { sehatCoins: 0 }, referrals: [] });
        }

        let entity;
        if (role === 'doctor') {
            entity = await Doctor.findById(userId) || await Doctor.findOne({ userId: userId });
        } else {
            entity = await User.findById(userId);
        }

        if (!entity) return res.status(404).json({ error: 'User/Doctor not found' });

        // Generate code if missing
        if (!entity.referralCode) {
            entity.referralCode = generateReferralCode(role);
            await entity.save();
        }

        // Find referrals where this entity is the referrer
        const referrals = await Referral.find({ referrerId: entity._id }).populate('refereeId', 'name email image createdAt');

        res.json({
            referralCode: entity.referralCode,
            wallet: entity.wallet,
            referrals
        });
    } catch (error) {
        console.error("Referral fetch error", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 🟢 VALIDATE REFERRAL CODE
router.post('/validate', async (req, res) => {
    try {
        const { code } = req.body;
        const user = await User.findOne({ referralCode: code });
        const doctor = await Doctor.findOne({ referralCode: code });

        if (user || doctor) {
            return res.json({ valid: true, owner: (user || doctor).name });
        }
        res.json({ valid: false });
    } catch (error) {
        res.status(500).json({ error: 'Validation failed' });
    }
});

// 🔴 ADMIN APIs

// GET ALL REFERRALS
router.get('/admin/all', async (req, res) => {
    try {
        const referrals = await Referral.find({})
            .populate('referrerId', 'name email role') // Need to ensure User model schema allows this population or generic ID
            .populate('refereeId', 'name email');
        res.json(referrals);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// APPROVE REFERRAL (Updated for Dual Credit)
router.put('/admin/:id/approve', async (req, res) => {
    try {
        const referral = await Referral.findById(req.params.id);
        if (!referral) return res.status(404).json({ error: 'Referral not found' });

        if (referral.status !== 'pending') {
            return res.status(400).json({ error: 'Referral already processed' });
        }

        const coins = req.body.coins || 50;

        // 1. Update Referral Status
        referral.status = 'approved';
        referral.approvedAt = new Date();
        referral.rewardCoins = coins;
        await referral.save();

        // 2. Credit REFERRER
        const referrerModel = referral.referrerRole === 'doctor' ? Doctor : User;
        const referrer = await referrerModel.findById(referral.referrerId);
        if (referrer) {
            referrer.wallet = referrer.wallet || { sehatCoins: 0 };
            referrer.wallet.sehatCoins += coins;
            await referrer.save();
        }

        // 3. Credit REFEREE (The new user)
        // Referee is always a User? Schema says `refereeRole: default 'user'`.
        const referee = await User.findById(referral.refereeId);
        if (referee) {
            referee.wallet = referee.wallet || { sehatCoins: 0 };
            referee.wallet.sehatCoins += coins; // Also credit the referee
            await referee.save();
        }

        res.json({ message: 'Approved & Coins Credited to Both Parties', referral });
    } catch (error) {
        console.error("Referral approval error", error);
        res.status(500).json({ error: 'Server error' });
    }
});

// REJECT REFERRAL
router.put('/admin/:id/reject', async (req, res) => {
    try {
        const referral = await Referral.findById(req.params.id);
        if (!referral) return res.status(404).json({ error: 'Referral not found' });

        referral.status = 'rejected';
        await referral.save();

        res.json({ message: 'Referral Rejected', referral });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
