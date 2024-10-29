const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String },
  profilePicture: Buffer,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // reference to User model
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
