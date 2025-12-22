import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorId: {
        type: String, // Or ObjectId if using a real Doctor model later
        required: true,
    },
    doctorName: {
        type: String,
        required: true,
    },
    specialty: {
        type: String,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled', 'treating'],
        default: 'pending',
    },
    tokenNumber: {
        type: Number,
    },
    queuePosition: {
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
