const mongoose = require('mongoose');

const consultationSchema = mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    consultationStartTime: { type: Date, required: true },
    consultationEndTime: { type: Date },
    durationMinutes: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Consultation', consultationSchema);
