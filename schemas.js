const Joi = require('joi');

module.exports.locationSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.string().required(),
  category: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  body: Joi.string().required(),
});
