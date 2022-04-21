const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const Location = require('./models/locations');
const Review = require('./models/review');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utilities/catchAsync');
const locations = require('./routes/locations');
const reviews = require('./routes/reviews');
const session = require('express-session');
const { locationSchema, reviewSchema } = require('./schemas');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user');
const local = require('passport-local');
const mongoose = require('mongoose');
const req = require('express/lib/request');
const ExpressError = require('./utilities/expressError');
const users = require('./routes/user');

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
const sessionConfig = {
  secret: 'easy',
  saveUninitialized: true,
  resave: false,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});
app.use(express.static('public'));
app.use('/', users);
app.use('/locations', locations);
app.use('/locations/:id/reviews', reviews);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/fake', async (req, res) => {
  const u = new User({ email: 'amer@gmail.com', username: 'hello' });
  const lol = await User.register(u, 'chicken');
  res.send(lol);
});

app.get('/', (req, res) => {
  res.render('home');
});

app.listen(3000, () => {
  console.log('listening to port 3000');
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});
