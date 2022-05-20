const Location = require('../models/locations');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({
  accessToken:
    'pk.eyJ1IjoiYW1lcmswMCIsImEiOiJjbDJqMHdnOW8wdDIwM2Zxd2VoajZqazJuIn0.L01AoI4L1nmt-iTTWVmVuA',
});
module.exports.category = async (req, res) => {
  const locations = await Location.find({
    $where: function () {
      return this.category == 'Hotel';
    },
  });
  res.render('locations/category', { locations });
};

module.exports.index = async (req, res) => {
  const locations = await Location.find({});
  res.render('locations/index', { locations });
};

module.exports.renderNewForm = (req, res) => {
  res.render('locations/new');
};

module.exports.createLocation = async (req, res) => {
  const geodata = await geocoder
    .forwardGeocode({
      query: req.body.city,
      limit: 1,
    })
    .send();
  console.log(geodata.body.features[0].geometry.coordinates);

  if (!req.body) {
    throw new ExpressError('invalid location data', 400);
  }

  const location = new Location(req.body);
  location.geometry = geodata.body.features[0].geometry;
  location.author = req.user._id;
  await location.save();
  console.log(location);
  req.flash('success', 'successfully made a new location');
  res.redirect(`/locations/${location._id}`);
};

module.exports.showLocation = async (req, res) => {
  const location = await Location.findById(req.params.id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');

  if (!location) {
    req.flash('error', 'Cannot Find That Location');
    return res.redirect('/locations');
  }
  res.render('locations/show', { location });
};

module.exports.renderEditForm = async (req, res) => {
  const location = await Location.findById(req.params.id);
  if (!location) {
    req.flash('error', 'Cannot Find That Location');
    return res.redirect('/locations');
  }
  res.render('locations/edit', { location });
};

module.exports.editLocation = async (req, res) => {
  const location = await Location.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });
  req.flash('success', 'successfully updated the location');
  res.redirect(`/locations/${location._id}`);
};

module.exports.deleteLocation = async (req, res) => {
  const location = await Location.findByIdAndDelete(req.params.id);
  req.flash('error', 'Deleted Location');
  res.redirect('/locations');
};
