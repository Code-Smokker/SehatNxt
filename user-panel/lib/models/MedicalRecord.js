import mongoose from 'mongoose';

const MedicalRecordSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileUrl: String,
    description: String,
    reportType: String,
}, { timestamps: true });

export default mongoose.models.MedicalRecord || mongoose.model('MedicalRecord', MedicalRecordSchema);
