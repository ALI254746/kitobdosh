import mongoose from 'mongoose';

// Ensure User schema is registered before Rent schema (optional but good practice)
// import './user'; 

const RentSchema = new mongoose.Schema({
  user: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'User'
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  bookTitle: { 
    type: String,
    required: true
  },
  bookImage: { 
    type: String
  },
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  lat: { type: Number },
  lng: { type: Number },
  passportUrl: {
    type: String, 
    required: true,
  },
  days: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['payme', 'click'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'returned', 'late', 'active', 'return_requested', 'courier_assigned', 'courier_picked_up'],
    default: 'pending',
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
  strict: false // Flexible schema for dev
});

// Force recompile to prevent schema caching issues
if (mongoose.models.Rent) {
  delete mongoose.models.Rent;
}

export default mongoose.model('Rent', RentSchema);
