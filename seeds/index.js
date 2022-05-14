const Location = require('../models/locations');
const Review = require('../models/review');
const cities = require('../seeds/cities');
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

const seedDb = async () => {
  await Review.deleteMany({});
  await Location.deleteMany({});
  for (let i = 0; i < 4; i++) {
    const location = new Location({
      author: '62612e903978f3216b9be87f',
      title: `${cities[i].title}`,
      city: `${cities[i].city}`,
      geometry: {
        type: 'Point',
        coordinates: [35.93333, 31.95],
      },
      image: `${cities[i].image}`,
      category: `${cities[i].category}`,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis rem, autem amet repellendus quibusdam porro odit omnis eum quo voluptatibus, suscipit distinctio laborum atque enim nulla impedit placeat quos vel!',
      price: `${cities[i].price}`,
    });
    location.save();
    console.log(location);
  }
};

seedDb();
