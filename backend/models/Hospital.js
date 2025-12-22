const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    type: { type: String }, // e.g. Multispeciality
    image: { type: String },
    address: {
        line1: String,
        area: { type: String, index: true },
        city: { type: String, index: true }
    },
    services: [String]
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
