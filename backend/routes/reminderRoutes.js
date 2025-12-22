const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');
const { protect } = require('../middleware/authMiddleware');

// Check for due reminders (Frontend Polling)
// GET /api/reminders/due
router.get('/due', protect, async (req, res) => {
    try {
        // Find reminders that are 'pending' and due, OR 'sent' very recently (for UI toast sync)
        // Actually, if backend marks as 'sent', frontend might miss it if polling interval > cron interval?
        // Better approach: Frontend polls for 'sent' reminders updated in last X seconds? 
        // OR Frontend simply checks for due reminders and *Backend* marks them sent?
        // Let's have Frontend check for due reminders that are NOT YET acknowledged/seen.
        // But backend cron is marking them 'sent'.
        // Let's fetch reminders marked 'sent' in the last 2 minutes.

        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        const recentReminders = await Reminder.find({
            userId: req.user._id,
            status: 'sent',
            updatedAt: { $gte: twoMinutesAgo }
        }).select('title datetime type');

        res.json({ success: true, reminders: recentReminders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
