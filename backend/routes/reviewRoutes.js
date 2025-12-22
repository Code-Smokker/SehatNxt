const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @route   POST /api/reviews
// @desc    Submit a review
router.post('/', async (req, res) => {
    try {
        const { doctorId, patientId, appointmentId, rating, review } = req.body;

        // 1. Check Appointment Validity
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        if (appointment.status !== 'completed' && appointment.status !== 'Completed') {
            return res.status(400).json({ message: "Can only rate completed appointments" });
        }

        // 2. Check for Duplicate
        const existingReview = await Review.findOne({ appointmentId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this appointment" });
        }

        // 3. Create Review
        const newReview = new Review({
            doctorId,
            patientId,
            appointmentId,
            rating,
            review
        });
        await newReview.save();

        res.status(201).json(newReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/reviews/doctor/:doctorId
// @desc    Get reviews for a specific doctor
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const reviews = await Review.find({ doctorId: req.params.doctorId })
            .populate('patientId', 'name image') // Populate patient details
            .sort({ createdAt: -1 });

        // Calculate average
        const total = reviews.length;
        const avg = total > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / total).toFixed(1) : 0;

        res.json({ reviews, average: avg, total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// @route   GET /api/reviews
// @desc    Get ALL reviews (Admin)
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('doctorId', 'name specialty')
            .populate('patientId', 'name')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
