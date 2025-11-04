const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['AVAILABLE', 'OUT_OF_STOCK', 'DISCONTINUED'],
    default: 'AVAILABLE',
  },
}, {
  timestamps: true, // Tự động tạo createdAt và updatedAt
});

module.exports = mongoose.model('Product', ProductSchema);

