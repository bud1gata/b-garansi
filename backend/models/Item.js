const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name for the item'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Laptop', 'Smartphone', 'Camera', 'Audio', 'Vehicle', 'Other', 'Laptop / PC', 'Camera & Lens', 'Audio Equipment', 'Other Electronics']
  },
  purchaseDate: {
    type: Date,
    required: [true, 'Please add a purchase date']
  },
  warrantyDurationMonths: {
    type: Number,
    required: [true, 'Please add warranty duration in months'],
    min: 0
  },
  receiptImage: {
    type: String,
    default: 'no-photo.jpg'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with services
ItemSchema.virtual('services', {
  ref: 'Service',
  localField: '_id',
  foreignField: 'item',
  justOne: false
});

module.exports = mongoose.model('Item', ItemSchema);
