const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { protect } = require('../middleware/authMiddleware');

// Add Address
router.post('/', protect, async (req, res) => {
    try {
        const address = await Address.create({
            userId: req.user._id,
            ...req.body
        });
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get User Addresses
router.get('/:userId', protect, async (req, res) => {
    try {
        // Ensure user only fetches their own addresses
        if (req.user._id.toString() !== req.params.userId) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const addresses = await Address.find({ userId: req.params.userId });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Address
router.put('/:id', protect, async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        if (address.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updated = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Address
router.delete('/:id', protect, async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        if (address.userId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await address.deleteOne();
        res.json({ message: 'Address removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
