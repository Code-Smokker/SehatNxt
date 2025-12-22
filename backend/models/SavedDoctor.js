const mongoose = require('mongoose');

const savedDoctorSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor', // Changed from 'User' to 'Doctor' assuming separate collection, or maintain 'User' if doctors are users.
        // User request specifically mentioned "reference Doctor". 
        // Given existing Doctor model context (from appointment routes), there is a Doctor collection.
        required: true
    },
    savedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Prevent duplications: A patient cannot save the same doctor twice
savedDoctorSchema.index({ patientId: 1, doctorId: 1 }, { unique: true });

const SavedDoctor = mongoose.models.SavedDoctor || mongoose.model('SavedDoctor', savedDoctorSchema);

module.exports = SavedDoctor;
