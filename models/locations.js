const { type } = require('express/lib/response');
const Review = require('./review.js');
const mongoose = require('mongoose');
const { required, number } = require('joi');

const Schema = mongoose.Schema;

const locationSchema = new Schema({
  title: String,
  price: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  image: String,
  description: String,
  city: String,
  category: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
});

locationSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model('Location', locationSchema);
