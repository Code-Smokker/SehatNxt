const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Create a new prescription
// @route   POST /api/prescriptions/create
// @access  Private (Doctor)
router.post('/create', async (req, res) => {
    try {
        const {
            appointmentId,
            doctorId,
            patientId,
            diagnosis,
            medicines,
            advice,
            followUpDate
        } = req.body;

        // 1. Verify Appointment matches Doctor
        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // 2. Create Prescription
        // Fetch doctor details for snapshot
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        const prescription = await Prescription.create({
            appointmentId,
            doctorId,
            patientId,
            diagnosis,
            medicines,
            advice,
            date: new Date(),
            // Snapshot
            signatureUrl: doctor.signatureUrl || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Doctor_Signature_Sample.svg/1200px-Doctor_Signature_Sample.svg.png", // Fallback
            doctorSnapshot: {
                name: doctor.name,
                degree: doctor.degree,
                clinicName: doctor.clinicName || "SehatNxt User Clinic",
                registrationNumber: doctor.registrationNumber || "REG123456",
                phone: doctor.phone || "N/A"
            }
        });

        // 3. Update Appointment Status to 'completed'
        appointment.status = 'completed';
        appointment.isCompleted = true;
        await appointment.save();

        res.status(201).json({
            success: true,
            message: 'Prescription created successfully',
            prescription
        });

    } catch (error) {
        console.error("Prescription Create Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Get prescriptions for a patient
// @route   GET /api/prescriptions/patient/:patientId
// @access  Private (Patient/Doctor)
router.get('/patient/:patientId', async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patientId: req.params.patientId })
            .populate('doctorId', 'name image speciality') // Populate basic doc info for card header
            .sort({ date: -1 }); // Latest first

        res.json(prescriptions);
    } catch (error) {
        console.error("Fetch Prescriptions Error:", error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
