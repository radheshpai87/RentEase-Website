import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  town: {
    type: String,
    required: true,
    trim: true
  },
  locality: {
    type: String,
    required: true,
    trim: true
  },
  pincode: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
locationSchema.index({ state: 1, city: 1, town: 1, locality: 1 });
locationSchema.index({ pincode: 1 });

const Location = mongoose.model('Location', locationSchema);

export default Location;