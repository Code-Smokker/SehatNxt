const mongoose = require('mongoose');

const specialtySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    image: { type: String },
    keywords: [String] // For intent search e.g. "skin" -> "Dermatologist"
}, { timestamps: true });

module.exports = mongoose.model('Specialty', specialtySchema);
