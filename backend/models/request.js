const mongoose = require('mongoose');

const requestSchema = mongoose.Schema({
  user: String,
  book: String,
  isProcessed: Boolean,
  date: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('Request', requestSchema);
