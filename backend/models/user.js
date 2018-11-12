const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  email: String,
  fname: String,
  lname: String,
  pwd: String,
  pickup: [{_id: false, title: String, expire: Number}],
  checkout: [{_id: false, title: String, expire: Number}],
  processing: [{_id: false, title: String, expire: Number}]
}, {
  versionKey: false
});

module.exports = mongoose.model('User', userSchema);
