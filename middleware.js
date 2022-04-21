const isloggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'you must be signed in');
    res.redirect('/register');
  }
  next();
};

module.exports = isloggedIn;
