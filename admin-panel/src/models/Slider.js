import mongoose from 'mongoose';

const sliderSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String },
    imageUrl: { type: String, required: [true, 'Image URL is required'] },
    ctaText: { type: String, default: 'Learn More' },
    ctaLink: { type: String, default: '/' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    // createdBy reference might be tricky if Admin ID is dependent on auth system. 
    // We'll make it optional for now or string.
    createdBy: { type: String }
}, { timestamps: true });

// Check if model exists to prevent overwrite error in HMR
const Slider = mongoose.models.Slider || mongoose.model('Slider', sliderSchema);

export default Slider;
