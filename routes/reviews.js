const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const Review = require('../models/review');
const Location = require('../models/locations');
const reviews = require('../controllers/reviews');
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

  catchAsync(reviews.createReview)
);

router.delete('/:reviewId', catchAsync(reviews.deleteReview));

module.exports = router;
