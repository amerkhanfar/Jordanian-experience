const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/expressError');
const isloggedIn = require('../middleware');
const Location = require('../models/locations');
const { locationSchema } = require('../schemas');
const locations = require('../controllers/locations');

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

const isAuthor = async (req, res, next) => {
  const location = await Location.findById(req.params.id);
  if (!location.author.equals(req.user._id)) {
    req.flash('error', 'You Are Not Authorized To Edit This Location');
    return res.redirect(`/locations/${location._id}`);
  }
  next();
};

router.get('/', catchAsync(locations.index));
router.get('/category', catchAsync(locations.category));
router.get('/new', isloggedIn, locations.renderNewForm);

router.get(
  '/login',
  catchAsync(async (req, res) => {
    const locations = await Location.find({});
    res.render('locations/login');
  })
);

router.post('/', validateLocation, catchAsync(locations.createLocation));

router.get('/:id', catchAsync(locations.showLocation));

router.get(
  '/:id/edit',
  isloggedIn,
  isAuthor,
  catchAsync(locations.renderEditForm)
);

router.put(
  '/:id',
  isloggedIn,
  isAuthor,
  validateLocation,
  catchAsync(locations.editLocation)
);

router.delete(
  '/:id',
  isAuthor,
  isloggedIn,
  catchAsync(locations.deleteLocation)
);

module.exports = router;
