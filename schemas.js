const Joi = require('joi');

module.exports.locationSchema = Joi.object({
  title: Joi.string().required(),
  price: Joi.string().required(),
  image: Joi.string().required(),
  description: Joi.string().required(),
  city: Joi.string().required(),
});
