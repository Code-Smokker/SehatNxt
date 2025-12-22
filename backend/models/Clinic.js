const mongoose = require('mongoose');

const clinicSchema = new mongoose.Schema({
    name: { type: String, required: true, index: true },
    image: { type: String },
    specialties: [String],
    address: {
        line1: String,
        area: { type: String, index: true },
        city: { type: String, index: true }
    },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' }]
}, { timestamps: true });

module.exports = mongoose.model('Clinic', clinicSchema);
