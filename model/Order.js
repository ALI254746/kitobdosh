import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    title: String,
    author: String,
    image: String,
    quantity: Number,
    price: Number,
    type: { type: String, enum: ['buy', 'rent'] },
    rentDays: Number // For rentals
  }],
  customer: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String }, // Optional if pickup
    lat: { type: Number },
    lng: { type: Number }
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'standard', 'express', 'courier'],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'payme', 'click'],
    default: 'cash'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymeTransactionId: { type: String },
  paymeTime: { type: Number }
}, { 
  timestamps: true,
  strict: false // Allow fields not in schema for flexibility during dev
});

// Delete model if it exists to force recompilation with new schema
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model('Order', OrderSchema);
