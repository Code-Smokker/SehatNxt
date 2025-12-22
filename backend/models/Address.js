const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    label: { type: String, enum: ['Home', 'Work', 'Other'], required: true },
    placeId: { type: String }, // Google Place ID
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    fullAddress: { type: String, required: true },
    landmark: { type: String, default: '' },
    houseNo: { type: String, default: '' } // Flat/House/Building
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
