const User = require('../models/user');

module.exports.createNewUser = async (req, res, next) => {
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
};

module.exports.loginUser = async (req, res) => {
  req.flash('success', 'welcome back');
  const redirectUrl = req.session.returnTo || '/locations';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash('success', 'Logged Out');
  res.redirect('/locations');
};
