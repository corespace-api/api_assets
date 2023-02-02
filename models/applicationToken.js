const mongoose = require('mongoose');

// create a function that returns the current date + 30 days
const expireData = () => {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date;
}

const appTokenSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  owner: { type: String, required: true},
  token: { type: String, required: true},
  appname: { type: String, required: true},
  created: { type: Date, default: Date.now },
  expires: { type: Date, default: expireData() },
  volume: { type: Object, default: { max: 1000, used: 0, lastUsed: Date.now()}},
  active: { type: Boolean, default: true }
});

const AppToken = mongoose.model('apptoken', appTokenSchema);

module.exports = AppToken;