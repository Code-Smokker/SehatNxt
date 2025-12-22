import mongoose from 'mongoose';

const SliderContentSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['tip', 'offer', 'announcement'],
        unique: true // Ensure only one active of each type if we just update documents
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    icon: { type: String, default: '✨' }, // Emoji or text icon
    gradient: { type: String, required: true }, // e.g., 'from-pink-500 to-rose-500'
    action: { type: String }, // Optional button text like "Book Now"
    link: { type: String }, // Optional link
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.models.SliderContent || mongoose.model('SliderContent', SliderContentSchema);
