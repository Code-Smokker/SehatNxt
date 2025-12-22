const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Search Patients
// Search Patients (Filtered by Doctor if provided)
router.get('/', async (req, res) => {
    try {
        const { search, doctorId } = req.query;
        let query = { role: 'patient' };

        // If doctorId is provided, restrict to patients linked to this doctor
        if (doctorId) {
            // Find patients from Appointments
            const Appointment = require('../models/Appointment');
            const appointmentPatients = await Appointment.find({ doctorId }).distinct('patientId');

            // Combine with explicitly linked patients
            query.$or = [
                { linkedDoctorId: doctorId },
                { _id: { $in: appointmentPatients } }
            ];
        }

        // Search logic
        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const searchFilter = [
                { name: searchRegex },
                { phone: searchRegex },
                { email: searchRegex },
                // Allow searching purely by ID string if possible, or assume frontend handles ID logic
                { _id: (mongoose.isValidObjectId(search) ? search : null) }
            ].filter(c => c._id !== null || c.name); // cleanup

            if (query.$or) {
                query.$and = [
                    { $or: query.$or },
                    { $or: [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }] }
                ];
                delete query.$or; // Cleared by $and
            } else {
                query.$or = [{ name: searchRegex }, { phone: searchRegex }, { email: searchRegex }];
            }
        }

        // If specific search override logic isn't clean, simplify:
        // We know Mongoose structure. Let's restart the query build for clarity.
        let finalQuery = { role: 'patient' };

        // 1. Doctor Filter
        if (doctorId) {
            const Appointment = require('../models/Appointment');
            const appointmentPatients = await Appointment.find({ doctorId }).distinct('patientId');
            finalQuery.$or = [
                { linkedDoctorId: doctorId },
                { _id: { $in: appointmentPatients } }
            ];
        }

        // 2. Search Filter
        if (search) {
            const searchPart = [
                { name: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];

            if (finalQuery.$or) {
                // Intersect doctor patients with search
                finalQuery = {
                    $and: [
                        { $or: finalQuery.$or },
                        { $or: searchPart }
                    ],
                    role: 'patient'
                };
            } else {
                finalQuery.$or = searchPart;
            }
        }

        const patients = await User.find(finalQuery).select('-password').sort({ createdAt: -1 });
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

// Create New Patient (Quick Add by Doctor)
router.post('/', async (req, res) => {
    try {
        const { name, phone, age, gender, email, linkedDoctorId } = req.body;

        // Simple check
        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ message: "Patient already exists with this phone" });

        // Create with dummy password (they can reset via OTP later if we impl that, or just stay as managed users)
        // For now, prompt implies real user creation.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("SehatNxt@123", salt); // Default password

        const newUser = await User.create({
            name,
            phone,
            email,
            age,
            gender,
            role: 'patient',
            linkedDoctorId, // Save the doctor link
            password: hashedPassword
        });

        res.status(201).json(newUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Single Patient Profile (for Doctor View)
router.get('/:id', async (req, res) => {
    try {
        const patient = await User.findById(req.params.id).select('-password');
        if (!patient) return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
