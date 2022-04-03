const { type } = require('express/lib/response');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  title: String,
  price: String,
  image: String,
  description: String,
  city: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

module.exports = mongoose.model('Location', locationSchema);
