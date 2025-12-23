const mongoose = require('mongoose');

const SliderContentSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['tip', 'offer', 'announcement'],
        unique: true
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    icon: { type: String, default: '✨' },
    gradient: { type: String, required: true },
    action: { type: String },
    link: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('SliderContent', SliderContentSchema);
