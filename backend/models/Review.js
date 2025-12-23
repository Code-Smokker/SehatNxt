const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true,
        unique: true // Ensure one review per appointment
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: false,
        default: ''
    }
}, { timestamps: true });

// Prevent duplicate reviews for the same appointment at database level
// reviewSchema.index({ appointmentId: 1 }, { unique: true }); // Removed as it's already defined in schema

module.exports = mongoose.model('Review', reviewSchema);
