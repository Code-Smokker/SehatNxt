const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Consultation = require('../models/Consultation');
const { protect } = require('../middleware/authMiddleware');

// Book Appointment (Protected: Needs User ID from Token)
router.post('/create', protect, async (req, res) => {
    try {
        console.log("Create Appointment Body:", req.body);
        const { doctorId, slotDate, slotTime, userData, docData, amount, date, clinicLocation, problem, type, time } = req.body;

        // Ensure standard fields if missing
        // Map frontend fields to Schema fields
        // Schema expects: userId, patientId, doctorId, date (Date), slotDate (String), slotTime (String), userData (Obj), docData (Obj), amount (Num), etc.

        const appointment = await Appointment.create({
            userId: req.user._id,
            patientId: req.user._id, // Required by strict schema
            doctorId,
            problem: problem || "General Consultation",
            date: date ? new Date(date) : new Date(), // Ensure Date object
            slotDate: slotDate || date,
            slotTime: slotTime || time,
            time: time || slotTime, // duplicate for schema compatibility if needed
            type: type || req.body.mode || 'clinic',
            status: 'pending',
            amount: amount || (docData ? docData.fees : 0),
            payment: false,
            isCompleted: false,
            clinicLocation,
            userData: userData || {}, // Save full object if schema allows
            docData: docData || {},
            tokenNumber: Math.floor(Math.random() * 100) + 1 // Generate random token
        });

        console.log("Appointment Created:", appointment._id);
        res.status(201).json({ success: true, message: "Appointment booked successfully", appointment });
    } catch (error) {
        console.error("Create Appointment Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get User Appointments (Protect or Public? Keeping protect for user privacy, but allowing if needed)
router.get('/user/:userId', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.params.userId })
            .populate('doctorId', 'name image speciality experience address degree fees')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Doctor Appointments (Public for now to allow Dashboard to fetch without Doctor Login flow)
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.params.doctorId })
            .populate('patientId', 'name image age gender phone')
            .sort({ date: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cancel/Update Status (Public for now)
router.patch('/status', async (req, res) => {
    const { appointmentId, status, cancelled, isCompleted } = req.body;
    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

        // Consultation Tracking Logic
        if (status === 'in_progress') {
            await Consultation.create({
                doctorId: appointment.doctorId,
                appointmentId: appointment._id,
                consultationStartTime: new Date()
            });
            // Optional: Update Doctor momentary state if needed for live status
            await Doctor.findByIdAndUpdate(appointment.doctorId, { currentConsultationStartTime: new Date() });

        } else if (status === 'completed' && appointment.status === 'in_progress') {
            const endTime = new Date();
            // Find the open consultation for this appointment
            const consultation = await Consultation.findOne({
                appointmentId: appointment._id,
                consultationEndTime: { $exists: false }
            });

            if (consultation) {
                const durationMs = endTime - new Date(consultation.consultationStartTime);
                const durationMinutes = Math.round(durationMs / 60000);

                consultation.consultationEndTime = endTime;
                consultation.durationMinutes = durationMinutes > 0 ? durationMinutes : 1; // Min 1 min
                await consultation.save();
            }
            // Clear doctor state
            await Doctor.findByIdAndUpdate(appointment.doctorId, { currentConsultationStartTime: null });
        }

        if (status) appointment.status = status;
        if (cancelled !== undefined) appointment.cancelled = cancelled;
        if (isCompleted !== undefined) appointment.isCompleted = isCompleted;

        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
