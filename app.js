const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const Location = require('./models/locations');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utilities/catchAsync');

const { locationSchema, reviewSchema } = require('./schemas');

const mongoose = require('mongoose');
const req = require('express/lib/request');
const ExpressError = require('./utilities/expressError');

mongoose.connect('mongodb://localhost:27017/jordanian-experience', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected the db');
});

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateLocation = (req, res, next) => {
  const { error } = locationSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((e) => {
      e.message.join(',');
      throw new ExpressError(msg, 400);
    });
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get(
  '/locations',
  catchAsync(async (req, res) => {
    const locations = await Location.find({});
    res.render('locations/index', { locations });
  })
);
app.get('/locations/new', (req, res) => {
  res.render('locations/new');
});

app.post(
  '/locations',
  validateLocation,
  catchAsync(async (req, res) => {
    if (!req.body) {
      throw new ExpressError('invalid location data', 400);
    }

    const location = new Location(req.body);
    await location.save();
    res.redirect(`/locations/${location._id}`);
  })
);

app.get(
  '/locations/:id',
  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id).populate('reviews');
    res.render('locations/show', { location });
  })
);

app.get(
  '/locations/:id/edit',
  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id);
    res.render('locations/edit', { location });
  })
);

app.put(
  '/locations/:id',
  validateLocation,
  catchAsync(async (req, res) => {
    const location = await Location.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res.redirect(`/locations/${location._id}`);
  })
);

app.delete(
  '/locations/:id',
  catchAsync(async (req, res) => {
    const location = await Location.findByIdAndDelete(req.params.id);
    res.redirect('/locations');
  })
);

app.post(
  '/locations/:id/reviews',

  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id);
    const { rating, body } = req.body;
    const review = new Review({ rating, body });
    location.reviews.push(review);
    await review.save();
    await location.save();
    res.redirect(`/locations/${location._id}`);
  })
);

app.delete(
  '/locations/:id/reviews/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Location.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/locations/${id}`);
  })
);

app.listen(3000, () => {
  console.log('listening to port 3000');
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});
