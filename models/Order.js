const mongoose = require('mongoose');
const OrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  qty: { type: Number, required: true, min: 1 }
}, { _id: false });
const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true, trim: true, maxlength: 160 },
  phone: { type: String, required: true, trim: true, maxlength: 40 },
  email: { type: String, default: '', trim: true, lowercase: true, maxlength: 254 },
  address: { type: String, required: true, trim: true, maxlength: 500 },
  city: { type: String, required: true, trim: true, maxlength: 100 },
  postalCode: { type: String, default: '', trim: true, maxlength: 30 },
  notes: { type: String, default: '', trim: true, maxlength: 1000 },
  items: { type: [OrderItemSchema], required: true },
  subtotal: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, enum: ['cod', 'manual'], default: 'cod' },
  status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending', index: true }
}, { timestamps: true });
module.exports = mongoose.model('Order', OrderSchema);
