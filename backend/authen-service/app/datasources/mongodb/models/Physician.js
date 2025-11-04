const mongoose = require('mongoose');

const WorkingTimeSchema = new mongoose.Schema({
  from: {
    h: { type: Number, required: true },
    m: { type: Number, required: true },
  },
  to: {
    h: { type: Number, required: true },
    m: { type: Number, required: true },
  },
}, { _id: false });

const DaysOfWeek = ['mon', 'tue', 'web', 'thu', 'fri', 'sat', 'sun'];

const workingTimeFields = {};
DaysOfWeek.forEach(day => {
  workingTimeFields[day] = [{ type: WorkingTimeSchema }];
});

const PhysicianSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true},
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  title: { type: String },
  dob: { type: String }, // YYYY-MM-DD
  contactInfo: {
    phone: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  status: { type: String, enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' },
  roles: [{ type: String, enum: ['PHYSICIAN', 'ADMIN'] }],
  facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Facility' }],
  workingTime: workingTimeFields,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

module.exports = mongoose.model('Physician', PhysicianSchema);
