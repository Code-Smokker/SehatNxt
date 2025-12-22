const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const Consultation = require('../models/Consultation');
const mongoose = require('mongoose');

// Get Dashboard Stats
router.get('/stats/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;

        // 1. Total Appointments Today
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const todayAppointments = await Appointment.countDocuments({
            doctorId,
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'cancelled' }
        });


        const distinctPatients = await Appointment.distinct('userId', { doctorId });

        // 2. New Patients (Patients registered today who booked this doctor?)
        // Requirement: "patients.filter(patient.createdAt === today)"
        // Finding users who have appointments with this doctor AND were created today
        const newPatients = await User.countDocuments({
            _id: { $in: distinctPatients },
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        // 3. Earnings (Sum of 'amount' for completed appointments today)
        // Assuming 'amount' field exists and status is 'completed' (or any if strictness not enforced)
        const earningsAgg = await Appointment.aggregate([
            {
                $match: {
                    doctorId,
                    date: { $gte: startOfDay, $lte: endOfDay },
                    // status: 'completed' 
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const todayEarnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

        // 4. Avg Consultation Time (from Consultation model)
        // Logic: Avg duration of all completed consultations for this doctor
        const avgStats = await Consultation.aggregate([
            { $match: { doctorId: new mongoose.Types.ObjectId(doctorId), durationMinutes: { $exists: true, $gt: 0 } } },
            { $group: { _id: null, avgTime: { $avg: "$durationMinutes" } } }
        ]);

        const avgConsultationTime = avgStats.length > 0 ? Math.round(avgStats[0].avgTime) : 0;

        // Return Data
        res.json({
            todayAppointments,
            newPatients,
            todayEarnings,
            avgConsultationTime, // In minutes
            pendingRequests: 0 // Legacy field, replaced by UI usage of above
        });

    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
