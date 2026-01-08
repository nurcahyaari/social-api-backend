const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  mbti: { type: String },
  enneagram: { type: String },
  variant: { type: String },
  tritype: { type: Number },
  socionics: { type: String },
  sloan: { type: String },
  psyche: { type: String },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);