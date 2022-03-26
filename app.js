const express = require('express');
const res = require('express/lib/response');
const app = express();
const path = require('path');
const Location = require('./models/locations');
const methodOverride = require('method-override');

const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/jordanian-experience', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('connected the db');
});

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/locations', async (req, res) => {
  const locations = await Location.find({});
  res.render('locations/index', { locations });
});
app.get('/locations/new', (req, res) => {
  res.render('locations/new');
});

app.post('/locations', async (req, res) => {
  const location = new Location(req.body);
  await location.save();
  res.redirect(`/locations/${location._id}`);
});

app.get('/locations/:id', async (req, res) => {
  const location = await Location.findById(req.params.id);
  res.render('locations/show', { location });
});

app.get('/locations/:id/edit', async (req, res) => {
  const location = await Location.findById(req.params.id);
  res.render('locations/edit', { location });
});

app.put('/locations/:id', async (req, res) => {
  const location = await Location.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });
  res.redirect(`/locations/${location._id}`);
});

app.delete('/locations/:id', async (req, res) => {
  const location = await Location.findByIdAndDelete(req.params.id);
  res.redirect('/locations');
});

app.listen(3000, () => {
  console.log('listening to port 3000');
});
