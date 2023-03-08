const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  uuid: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  version: { type: String, required: true },
  startedAt: { type: Date, required: true, default: Date.now() },
  lastSeen: { type: Date, required: true, default: Date.now() },
  status: { type: String, required: true, default: 'active' },
  command: { type: String, require: false, default: '' }
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;