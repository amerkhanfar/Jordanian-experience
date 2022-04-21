const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const isloggedIn = require('../middleware');
const Location = require('../models/locations');
const { locationSchema } = require('../schemas');

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

router.get(
  '/',
  catchAsync(async (req, res) => {
    const locations = await Location.find({});
    res.render('locations/index', { locations });
  })
);
router.get('/new', isloggedIn, (req, res) => {
  res.render('locations/new');
});

router.get(
  '/login',
  catchAsync(async (req, res) => {
    const locations = await Location.find({});
    res.render('locations/login');
  })
);

router.post(
  '/',
  validateLocation,
  catchAsync(async (req, res) => {
    if (!req.body) {
      throw new ExpressError('invalid location data', 400);
    }

    const location = new Location(req.body);
    await location.save();
    req.flash('success', 'successfully made a new location');
    res.redirect(`/locations/${location._id}`);
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id).populate('reviews');
    if (!location) {
      req.flash('error', 'Cannot Find That Location');
      return res.redirect('/locations');
    }
    res.render('locations/show', { location });
  })
);

router.get(
  '/:id/edit',
  isloggedIn,
  catchAsync(async (req, res) => {
    const location = await Location.findById(req.params.id);
    if (!location) {
      req.flash('error', 'Cannot Find That Location');
      return res.redirect('/locations');
    }
    res.render('locations/edit', { location });
  })
);

router.put(
  '/:id',
  isloggedIn,
  validateLocation,
  catchAsync(async (req, res) => {
    const location = await Location.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    req.flash('success', 'successfully updated the location');
    res.redirect(`/locations/${location._id}`);
  })
);

router.delete(
  '/:id',
  isloggedIn,
  catchAsync(async (req, res) => {
    const location = await Location.findByIdAndDelete(req.params.id);
    req.flash('error', 'Deleted Location');
    res.redirect('/locations');
  })
);

module.exports = router;
