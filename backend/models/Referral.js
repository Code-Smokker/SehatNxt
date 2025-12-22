const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    referrerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    referrerRole: { type: String, enum: ['user', 'doctor'], default: 'user' },
    refereeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    refereeRole: { type: String, default: 'user' },
    referralCode: { type: String }, // Code used
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    rewardCoins: { type: Number, default: 50 },
    approvedAt: { type: Date },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Referral', referralSchema);
