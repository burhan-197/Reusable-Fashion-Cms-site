const mongoose = require('mongoose');
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true, maxlength: 120 },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  price: { type: Number, required: true, min: 0.01 },
  stock: { type: Number, required: true, default: 0, min: 0, validate: { validator: Number.isInteger, message: 'Stock must be a whole number.' } },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
  images: { type: [String], default: [], validate: { validator: v => v.length <= 4, message: 'A product can have at most 4 images.' } }
}, { timestamps: true });
ProductSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('Product', ProductSchema);
