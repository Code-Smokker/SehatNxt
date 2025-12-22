const express = require('express');
const router = express.Router();
const SavedDoctor = require('../models/SavedDoctor');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/my-doctors/save
// @desc    Save a doctor (Toggle: Save if not exists, remove if exists, or strict add based on requirement. User asked for save/remove logic)
//          User asked: POST /save -> save doctor. DELETE /remove -> remove.
//          Let's implement explicit Save and Remove.
// @access  Private
router.post('/save', protect, async (req, res) => {
    try {
        const { doctorId } = req.body;
        const patientId = req.user.id;

        if (!doctorId) {
            return res.status(400).json({ success: false, message: "Doctor ID is required" });
        }

        // Check if already saved
        const existing = await SavedDoctor.findOne({ patientId, doctorId });
        if (existing) {
            return res.status(400).json({ success: false, message: "Doctor already saved" });
        }

        const newSaved = new SavedDoctor({ patientId, doctorId });
        await newSaved.save();

        res.status(201).json({ success: true, message: "Doctor saved successfully" });

    } catch (error) {
        console.error("Error saving doctor:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// @route   DELETE /api/my-doctors/remove/:doctorId
// @desc    Remove a doctor from saved list
// @access  Private
router.delete('/remove/:doctorId', protect, async (req, res) => {
    try {
        const { doctorId } = req.params;
        const patientId = req.user.id;

        const deleted = await SavedDoctor.findOneAndDelete({ patientId, doctorId });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Doctor not found in saved list" });
        }

        res.json({ success: true, message: "Doctor removed from saved list" });

    } catch (error) {
        console.error("Error removing doctor:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// @route   GET /api/my-doctors
// @desc    Get list of saved doctors for logged-in user
// @access  Private
// @populate Returns full doctor details
router.get('/', protect, async (req, res) => {
    try {
        const patientId = req.user.id;

        const savedDocs = await SavedDoctor.find({ patientId })
            .populate('doctorId', 'name speciality image experience degree fees clinicName address')
            .sort({ savedAt: -1 });

        // Transform to return just doctor objects with saved metadata if needed, 
        // or just the list of doctors. 
        // Let's return the structured data so frontend can map easily.
        // Frontend likely expects a list of doctors.

        const doctors = savedDocs.map(item => {
            if (!item.doctorId) return null; // Handle if doctor was deleted
            return {
                ...item.doctorId._doc,
                savedAt: item.savedAt
            };
        }).filter(Boolean);

        res.json({ success: true, doctors });

    } catch (error) {
        console.error("Error fetching saved doctors:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// @route   GET /api/my-doctors/check/:doctorId
// @desc    Check if a specific doctor is saved
// @access  Private
router.get('/check/:doctorId', protect, async (req, res) => {
    try {
        const { doctorId } = req.params;
        const patientId = req.user.id;

        const exists = await SavedDoctor.exists({ patientId, doctorId });
        res.json({ success: true, saved: !!exists });

    } catch (error) {
        console.error("Error checking saved status:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
