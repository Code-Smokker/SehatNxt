import mongoose from 'mongoose';

const UserAddressSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    label: {
        type: String,
        required: true,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    },
    placeId: { type: String }, // Optional but good for reference
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    fullAddress: { type: String, required: true }, // The formatted address
    landmark: { type: String, default: '' },
    // Optional: add flat/floor details if needed later
}, { timestamps: true });

export default mongoose.models.UserAddress || mongoose.model('UserAddress', UserAddressSchema);
