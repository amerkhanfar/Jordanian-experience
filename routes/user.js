const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { route } = require('./locations');
const catchAsync = require('../utilities/catchAsync');
const users = require('../controllers/users');

router.get('/register', (req, res) => {
  res.render('locations/login');
});

router.post('/register', catchAsync(users.createNewUser));

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/register',
  }),
  users.loginUser
);

router.get('/logout', users.logoutUser);
module.exports = router;
