const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.ObjectId,
    ref: 'Item',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please add the date of the service']
  },
  cost: {
    type: Number,
    required: [true, 'Please add the cost of the service (0 if free/warranty)'],
    min: 0
  },
  description: {
    type: String,
    required: [true, 'Please add a description of the issue or fix'],
    maxlength: 500
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);
