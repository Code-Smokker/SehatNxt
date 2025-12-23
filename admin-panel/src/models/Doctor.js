const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const doctorSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to User
    name: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    fees: { type: Number, required: true },
    address: {
        line1: { type: String, required: true },
        line2: { type: String, required: true }
    },
    // Removed duplicate email/phone/password as they live in User, but keeping for legacy compatibility if needed
    // Ideally we should sync or just use User's. For now, keep as cached fields but make optional?
    // Requirement: "Doctors collection... userId... name... image..."
    // Let's keep them but maybe relax requirements if they come from User?
    // Actually, Doctor profile might have different public email/phone. Keep them.
    email: { type: String, unique: true },
    phone: { type: String, unique: true },

    // System & Availability
    available: { type: Boolean, default: true },
    isActive: { type: Boolean, default: false }, // Default hidden until approved/complete
    slots_booked: { type: Object, default: {} },
    isProfileComplete: { type: Boolean, default: false },

    // Consultation Tracking (Transient State)
    currentConsultationStartTime: { type: Date }
}, { timestamps: true, minimize: false });

doctorSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

doctorSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Doctor', doctorSchema);
