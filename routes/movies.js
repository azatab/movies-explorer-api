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
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom(urlvalidator, 'custom URL validator'),
    }),
  }),
  addMovie,
);
router.get('/movies', getMovies);
router.delete(
  '/movies/:movieId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24),
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
