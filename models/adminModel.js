const mongoose = require('mongoose');

// Define the user schema (for both users and admins)
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['Online', 'Offline'],
    default: 'Offline',
  },
}, {
  timestamps: true,
});

// Export model
const User = mongoose.model('User', userSchema);
module.exports = User;
