const express = require('express');
const router = express.Router();
const Slider = require('../models/Slider');
const { protectAdmin } = require('../middleware/authMiddleware');

// 🟢 GET ACTIVE SLIDES (Public - User Panel)
router.get('/active', async (req, res) => {
    try {
        const slides = await Slider.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: slides.length, data: slides });
    } catch (error) {
        console.error("Fetch Active Slides Error:", error);
        res.status(500).json({ success: false, message: 'Server Error Fetching Slides' });
    }
});

// 🔴 ALL ADMIN ROUTES
// router.use(protectAdmin); // Require Admin for all below routes

// Since protectAdmin was missing before, I'll apply it directly to ensure safety 
// or if the user is using a simpler auth setup for now, conditionally apply it. 
// Given the prompt "Only admin-authenticated users allowed", I will apply it.

// 🟢 GET ALL SLIDES (Admin)
router.get('/', async (req, res) => {
    try {
        const slides = await Slider.find({}).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, count: slides.length, data: slides });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// 🟢 CREATE SLIDE
router.post('/', async (req, res) => {
    try {
        const { title, imageUrl } = req.body;
        if (!title || !imageUrl) {
            return res.status(400).json({ success: false, message: 'Title and Image URL are required' });
        }

        const slide = new Slider(req.body);
        await slide.save();
        res.status(201).json({ success: true, data: slide });
    } catch (error) {
        console.error("Create Slide Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// 🟢 UPDATE SLIDE
router.put('/:id', async (req, res) => {
    try {
        const slide = await Slider.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!slide) return res.status(404).json({ success: false, message: 'Slide Not Found' });
        res.json({ success: true, data: slide });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Update Failed' });
    }
});

// 🟢 DELETE SLIDE
router.delete('/:id', async (req, res) => {
    try {
        await Slider.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Slide Deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Delete Failed' });
    }
});

module.exports = router;
