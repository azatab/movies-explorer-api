const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const urlvalidator = (value, helpers) => {
  if (validator.isURL(value, { require_protocol: true })) {
    return value;
  }
  return helpers.message('Некорректный URL');
};

const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const validateMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(30),
    director: Joi.string().required().min(2).max(30),
    duration: Joi.number().required(),
    year: Joi.string().required().min(2).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().custom(urlvalidator, 'custom URL validator'),
    trailer: Joi.string().required().custom(urlvalidator, 'custom URL validator'),
    thumbnail: Joi.string().required().custom(urlvalidator, 'custom URL validator'),
    owner: Joi.string().hex().length(24),
    movieId: Joi.string().required(),
    nameRu: Joi.string().required(),
    nameEn: Joi.string().required(),
  }),
});

const validateId = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
});

const validateUpdatedata = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

module.exports = {
  urlvalidator, validateSignin, validateSignup, validateMovie, validateId, validateUpdatedata,
};
