import mongoose from 'mongoose';
const schema = new mongoose.Schema({ publicId: { type: String, required: true, unique: true }, owner: { type: mongoose.Schema.Types.ObjectId, required: true }, private: { type: Boolean, default: false }, folder: String }, { timestamps: true });
export default mongoose.models.UploadAsset || mongoose.model('UploadAsset', schema);
