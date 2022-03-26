const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  title: String,
  price: String,
  image: String,
  description: String,
  city: String,
});

module.exports = mongoose.model('Location', locationSchema);
