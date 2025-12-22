const mongoose = require('mongoose');

const prescriptionSchema = mongoose.Schema({
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true, unique: true }, // One prescription per appointment
    date: { type: Date, default: Date.now },
    diagnosis: { type: String, required: true },
    medicines: [{
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        duration: { type: String, required: true },
        frequency: { type: String, required: true },
        instruction: { type: String }
    }],
    advice: { type: String },

    // Doctor Snapshot & Signature (Autofilled)
    signatureUrl: { type: String, required: true },
    doctorSnapshot: {
        name: { type: String, required: true },
        degree: { type: String, required: true },
        clinicName: { type: String, required: true },
        registrationNumber: { type: String, required: true },
        phone: { type: String, required: true }
    }
}, { timestamps: true });

module.exports = mongoose.model('Prescription', prescriptionSchema);
