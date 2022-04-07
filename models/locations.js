const { type } = require('express/lib/response');
const Review = require('./review.js');
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
