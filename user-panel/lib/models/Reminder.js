import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    time: { type: String, required: true }, // Format: "HH:mm"
    type: { type: String, default: 'pill' },
    repeat: { type: String, default: 'daily' },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
    lastTriggeredAt: { type: Date }
}, { timestamps: true });

export default mongoose.models.Reminder || mongoose.model('Reminder', ReminderSchema);
