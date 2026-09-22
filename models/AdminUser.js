const mongoose = require('mongoose');
const AdminUserSchema = new mongoose.Schema({
  singletonKey: { type: String, default: 'primary', unique: true, immutable: true },
  username: { type: String, required: true, trim: true, minlength: 3, maxlength: 60 },
  usernameNormalized: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  sessionVersion: { type: Number, default: 1, min: 1 },
  lastLoginAt: { type: Date, default: null }
}, { timestamps: true });
AdminUserSchema.pre('validate', function () {
  this.username = String(this.username || '').trim();
  this.usernameNormalized = this.username.toLowerCase();
});
module.exports = mongoose.model('AdminUser', AdminUserSchema);
