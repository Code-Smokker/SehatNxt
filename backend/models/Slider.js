const mongoose = require('mongoose');

const sliderSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'Title is required'] },
    description: { type: String },
    imageUrl: { type: String, required: [true, 'Image URL is required'] },
    ctaText: { type: String, default: 'Learn More' },
    ctaLink: { type: String, default: '/' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
}, { timestamps: true });

module.exports = mongoose.model('Slider', sliderSchema);
