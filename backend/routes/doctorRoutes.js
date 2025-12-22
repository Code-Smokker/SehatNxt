const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// GET /api/doctor/list - List all active doctors
router.get('/list', async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true }).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST /api/doctor/update-profile - Create or Update Profile
const { protect } = require('../middleware/authMiddleware');

router.get('/profile', protect, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor profile not found' });
        }
        res.json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/update-profile', protect, async (req, res) => {
    try {
        const { name, speciality, degree, experience, about, fees, address, image, phone, clinicName, registrationNumber, signatureUrl } = req.body;
        console.log("Update Profile Body:", req.body);
        // Identify User or Doctor from Token
        let userId, userPhone, userEmail;

        if (req.user) {
            userId = req.user._id;
            userPhone = req.user.phone;
            userEmail = req.user.email;
        } else if (req.doctor) {
            userId = req.doctor.userId; // If doctor token, it usually links back to a userId or helps identify
            // However, strict schema requires 'userId' (User ref). 
            // If the token is for a doctor, we might need to find the linked user or just use the doctor's existing userId field.
            // Let's assume req.doctor has userId populated or available.
            userId = req.doctor.userId;
            userPhone = req.doctor.phone;
            userEmail = req.doctor.email;
        } else {
            return res.status(401).json({ success: false, message: "User identity not found in request" });
        }

        console.log("Identified UserID:", userId);

        // Validation (Basic)
        if (!name || !speciality || !fees) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        let doctor = await Doctor.findOne({ userId });

        const doctorData = {
            userId,
            name,
            speciality,
            degree,
            experience,
            about,
            fees,
            address, // Object { line1, line2 }
            image,
            phone: phone || userPhone, // fallback to user phone
            email: userEmail, // sync email
            clinicName: clinicName || "SehatNxt User Clinic",
            registrationNumber: registrationNumber || "N/A",
            signatureUrl: signatureUrl || null, // Allow setting signature
            isProfileComplete: true,
            isActive: true // Auto-activate per requirement
        };

        if (doctor) {
            // Update
            // If signatureUrl is not passed, don't overwrite it with null if it exists
            if (signatureUrl === undefined && doctor.signatureUrl) {
                doctorData.signatureUrl = doctor.signatureUrl;
            }
            doctor = await Doctor.findOneAndUpdate({ userId }, doctorData, { new: true });
        } else {
            // Create
            doctor = await Doctor.create(doctorData);
        }

        res.json({ success: true, doctor });
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET /api/doctor/:id - Get specific doctor details
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id).select('-password');
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }
        res.json({ success: true, doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
