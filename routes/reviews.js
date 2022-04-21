const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const Review = require('../models/review');
const Location = require('../models/locations');
const { reviewSchema } = require('../schemas');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
router.post(
  '/',

  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id);
    const { rating, body } = req.body;
    const review = new Review({ rating, body });
    location.reviews.push(review);
    await review.save();
    await location.save();
    req.flash('success', 'Created New Review');
    res.redirect(`/locations/${location._id}`);
  })
);

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Location.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('error', 'Deleted Review');
    res.redirect(`/locations/${id}`);
  })
);

module.exports = router;
