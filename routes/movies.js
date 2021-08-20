const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlvalidator = require('../middlewares/url-validation');

const {
  addMovie, getMovies, deleteMovie, /* putLike, removeLike, */
} = require('../controllers/movies');

router.post(
  '/movies',
  celebrate({
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
  }),
  addMovie,
);
router.get('/movies', getMovies);
router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie,
);
// router.put(
//   '/cards/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().hex().length(24),
//     }),
//   }),
//   putLike,
// );
// router.delete(
//   '/cards/:cardId/likes',
//   celebrate({
//     params: Joi.object().keys({
//       cardId: Joi.string().hex().length(24),
//     }),
//   }),
//   removeLike,
// );

module.exports = router;
