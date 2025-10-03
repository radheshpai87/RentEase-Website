import mongoose from 'mongoose';

const cmsSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['banner', 'faq', 'blog', 'testimonial', 'social_link']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    author: String,
    tags: [String],
    excerpt: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

cmsSchema.index({ type: 1, isActive: 1, order: 1 });

cmsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CMS = mongoose.model('CMS', cmsSchema);

export default CMS;