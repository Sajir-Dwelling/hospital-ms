const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  age: { type: Number },
  bloodGroup: {
    type: String,
    enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-',''],
    default: '',
  },
  assignedDoctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
  },
  medicalHistory: [{ type: String }],
  status: {
    type: String,
    enum: ['Active', 'Admitted', 'Discharged'],
    default: 'Active',
  },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
