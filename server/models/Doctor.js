const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  slots: [String],
}, { _id: false });

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
  },
  qualification: { type: String, trim: true },
  experience: { type: String, trim: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalPatients: { type: Number, default: 0 },
  availability: [availabilitySchema],
  bio: { type: String },
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
