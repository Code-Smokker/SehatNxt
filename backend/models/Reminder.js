const mongoose = require('mongoose');

const reminderSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    time: { type: String, required: true }, // Format: "HH:mm" (24-hour)
    type: { type: String, default: 'pill' },
    repeat: { type: String, default: 'daily' },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
    lastTriggeredAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
