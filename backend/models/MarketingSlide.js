const mongoose = require('mongoose');

const marketingSlideSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true }, // S3 or generic URL
    ctaText: { type: String, default: 'Learn More' },
    ctaLink: { type: String, default: '/' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MarketingSlide', marketingSlideSchema);
