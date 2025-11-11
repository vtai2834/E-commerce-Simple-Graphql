const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // Có thể thêm các trường khác nếu cần
});

module.exports = mongoose.model('Admin', AdminSchema);
