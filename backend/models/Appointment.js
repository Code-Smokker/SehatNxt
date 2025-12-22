const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Keeping userId for backward compat or alias to patientId
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    problem: { type: String, required: true },
    date: { type: Date, required: true }, // Storing as Date object for queries
    time: { type: String, required: true },
    type: { type: String, enum: ['clinic', 'video'], default: 'clinic' },
    status: { type: String, enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
    tokenNumber: { type: Number, required: true },

    // Snapshots (Optional but checking if strict req forbids them. Req says "Schema: ...". I will keep them minimal or rely on lookup)
    // Going strictly with requested fields + what's needed for UI
    slotDate: { type: String }, // Keep for slot management
    slotTime: { type: String }, // Keep for slot management
    amount: { type: Number, required: true },
    payment: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false },
    clinicLocation: {
        placeId: String,
        lat: Number,
        lng: Number,
        address: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
