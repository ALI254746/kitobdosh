import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  providerId: { type: String, required: true, unique: true },
  target: { type: mongoose.Schema.Types.ObjectId, required: true },
  targetModel: { type: String, enum: ['Order', 'Rent'], required: true },
  amount: { type: Number, required: true },
  providerTime: { type: Number, required: true },
  createTime: { type: Number, required: true }, performTime: { type: Number, default: 0 }, cancelTime: { type: Number, default: 0 },
  state: { type: Number, enum: [1, 2, -1, -2], required: true }, reason: { type: Number, default: null }
});
schema.index({ target: 1, targetModel: 1 }, { unique: true, partialFilterExpression: { state: { $gte: 1 } } });
export default mongoose.models.PaymentTransaction || mongoose.model('PaymentTransaction', schema);
