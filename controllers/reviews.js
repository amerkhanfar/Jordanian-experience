const Review = require('../models/review');
const Location = require('../models/locations');

module.exports.createReview = async (req, res) => {
  const location = await Location.findById(req.params.id);
  const { rating, body } = req.body;
  const review = new Review({ rating, body });
  review.author = req.user._id;
  location.reviews.push(review);
  await review.save();
  await location.save();
  req.flash('success', 'Created New Review');
  res.redirect(`/locations/${location._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Location.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('error', 'Deleted Review');
  res.redirect(`/locations/${id}`);
};
