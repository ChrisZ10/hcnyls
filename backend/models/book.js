const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
  isbn: [String],
  title: String,
  author: [String],
  desc: String,
  avail: Boolean,
  count: Number
}, {
  versionKey: false
});

module.exports = mongoose.model('Book', bookSchema);
