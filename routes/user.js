const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { route } = require('./locations');
const catchAsync = require('../utilities/catchAsync');

router.get('/register', (req, res) => {
  res.render('locations/login');
});

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Jordanian Experience');
        res.redirect('/locations');
      });
    } catch (e) {
      req.flash('error', e.message);
      console.log(e.message);
      res.redirect('/register');
    }
  })
);

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/register',
  }),
  async (req, res) => {
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/locations';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged Out');
  res.redirect('/locations');
});
module.exports = router;
