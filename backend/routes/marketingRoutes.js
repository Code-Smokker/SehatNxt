const express = require('express');
const router = express.Router();
const MarketingSlide = require('../models/MarketingSlide');

// 🟢 GET ALL SLIDES (Admin)
router.get('/', async (req, res) => {
    try {
        const slides = await MarketingSlide.find({}).sort({ order: 1, createdAt: -1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 🟢 GET ACTIVE SLIDES (User)
router.get('/active', async (req, res) => {
    try {
        const slides = await MarketingSlide.find({ isActive: true }).sort({ order: 1, createdAt: -1 });
        res.json(slides);
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

// 🟢 CREATE SLIDE
router.post('/', async (req, res) => {
    try {
        const slide = new MarketingSlide(req.body);
        await slide.save();
        res.status(201).json(slide);
    } catch (error) {
        res.status(400).json({ error: 'Invalid Data' });
    }
});

// 🟢 UPDATE SLIDE
router.put('/:id', async (req, res) => {
    try {
        const slide = await MarketingSlide.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!slide) return res.status(404).json({ error: 'Slide Not Found' });
        res.json(slide);
    } catch (error) {
        res.status(400).json({ error: 'Update Failed' });
    }
});

// 🟢 DELETE SLIDE
router.delete('/:id', async (req, res) => {
    try {
        await MarketingSlide.findByIdAndDelete(req.params.id);
        res.json({ message: 'Slide Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Delete Failed' });
    }
});

module.exports = router;
