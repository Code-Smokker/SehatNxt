const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, expires: 600 }, // Auto-delete after 10 mins (600s) from this time
}, { timestamps: true });

module.exports = mongoose.model('Otp', OtpSchema);
