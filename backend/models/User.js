const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    // Auth & Identity
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    phone: { type: String, unique: true },
    name: { type: String, default: 'New User' },
    role: { type: String, default: 'patient' },
    image: { type: String }, // User Avatar
    isActive: { type: Boolean, default: true },
    linkedDoctorId: { type: String, default: null },

    // Personal Details
    gender: { type: String },
    dob: { type: String }, // Date of Birth (YYYY-MM-DD or similar)
    age: { type: Number }, // Can be derived, but storing for quick access if needed
    bloodGroup: { type: String },
    maritalStatus: { type: String },
    height: { type: String },
    weight: { type: String },
    emergencyContact: { type: String },
    location: { type: String }, // City, State, Country
    address: { type: Object, default: {} }, // Detailed address structure

    // Medical History
    allergies: { type: String },        // e.g. "Peanuts, Penicillin"
    currentMedicine: { type: String },  // e.g. "Paracetamol"
    pastMedicine: { type: String },     // Previous medications
    chronicDiseases: { type: String },  // e.g. "Diabetes, Hypertension"
    injuries: { type: String },         // e.g. "Fractured Arm 2010"
    surgeries: { type: String },        // e.g. "Appendectomy"

    // Lifestyle
    smoking: { type: String },          // e.g. "Never", "Occasionally"
    alcohol: { type: String },          // e.g. "Socially"
    activityLevel: { type: String },    // e.g. "Sedentary", "Active"
    foodPreference: { type: String },   // e.g. "Vegetarian", "Non-Veg"
    occupation: { type: String },       // e.g. "Engineer"

    // Gamification & Referrals
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },
    wallet: {
        sehatCoins: { type: Number, default: 0 }
    }
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) { // Added 'next'
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
