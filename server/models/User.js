const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  age: {
    type: Number,
    required: true
  },
  best_score: {
    type: Number,
    default: 0
  },
  last_score: {
    type: Number,
    default: 0
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Assuming user_id is the default _id provided by MongoDB, 
// strictly adding a custom user_id if needed, but usually redundant.
// If a specific string/number ID is strictly required separate from _id:
// userSchema.add({ user_id: { type: String, unique: true } });

const User = mongoose.model('User', userSchema);

module.exports = User;
