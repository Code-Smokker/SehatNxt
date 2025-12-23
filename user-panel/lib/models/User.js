import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    // Auth & Identity
    email: { type: String, unique: true, required: true },
    password: { type: String, select: false }, // Optional for Google users
    phone: { type: String, unique: true, sparse: true }, // Optional, unique only if present
    name: { type: String, required: true },
    role: { type: String, enum: ["patient"], default: "patient" },
    image: { type: String }, // User Avatar

    authProvider: {
        type: String,
        enum: ["google", "email"],
        required: true,
        default: "email"
    },
    googleId: { type: String },
    isProfileComplete: { type: Boolean, default: false },

    isActive: { type: Boolean, default: true },
    linkedDoctorId: { type: String, default: null },

    // Personal Details
    gender: { type: String },
    dob: { type: String },
    age: { type: Number },
    bloodGroup: { type: String },
    maritalStatus: { type: String },
    height: { type: String },
    weight: { type: String },
    emergencyContact: { type: String },
    location: { type: String },
    address: { type: Object, default: {} },

    // Medical History
    allergies: { type: String },
    currentMedicine: { type: String },
    pastMedicine: { type: String },
    chronicDiseases: { type: String },
    injuries: { type: String },
    surgeries: { type: String },

    // Lifestyle
    smoking: { type: String },
    alcohol: { type: String },
    activityLevel: { type: String },
    foodPreference: { type: String },
    occupation: { type: String },

    // Gamification & Referrals
    referralCode: { type: String, unique: true, sparse: true },
    referredBy: { type: String },
    wallet: {
        sehatCoins: { type: Number, default: 0 }
    }
}, { timestamps: true });

// Password Match Method
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hash Password Pre-Save
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Next.js Hot Reload Fix
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
