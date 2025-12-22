const cron = require('node-cron');
const Reminder = require('../models/Reminder');

const initScheduler = () => {
    console.log("⏰ Daily Reminder Scheduler Initialized (Every Minute)");

    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const currentHours = String(now.getHours()).padStart(2, '0');
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${currentHours}:${currentMinutes}`;

            // Find active daily reminders set for this time
            // AND not triggered today

            // We can't query "lastTriggeredAt != today" easily in comparrison directly in find without aggregation or post-filter
            // Simpler: find all active for this time, then filter.

            const dueReminders = await Reminder.find({
                status: 'active',
                repeat: 'daily',
                time: currentTime
            });

            if (dueReminders.length > 0) {
                const todayCurrentDate = now.toDateString();

                for (const reminder of dueReminders) {
                    const lastTriggeredDate = reminder.lastTriggeredAt ? new Date(reminder.lastTriggeredAt).toDateString() : null;

                    if (lastTriggeredDate !== todayCurrentDate) {
                        // Needs triggering
                        reminder.lastTriggeredAt = new Date();
                        await reminder.save();

                        console.log(`🔔 Daily Reminder Sent: ${reminder.title} for User ${reminder.userId} at ${currentTime}`);

                        // NOTE: In a real system, we'd push to a Notification Queue or Send WebPush here.
                        // Since we rely on Frontend Polling for alerts, we just updated 'lastTriggeredAt'.
                        // The Frontend route /due needs to check 'lastTriggeredAt' is recent (e.g. last 2 mins).
                    }
                }
            }
        } catch (error) {
            console.error("Scheduler Error:", error);
        }
    });
};

module.exports = initScheduler;
