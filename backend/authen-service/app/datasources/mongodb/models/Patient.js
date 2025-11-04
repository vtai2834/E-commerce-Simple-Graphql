const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: String }, // YYYY-MM-DD
  contactInfo: {
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  currentCarePlan: { type: mongoose.Schema.Types.ObjectId, ref: 'CarePlan' },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

module.exports = mongoose.model('Patient', PatientSchema);
