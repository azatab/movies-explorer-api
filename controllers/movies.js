const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbidden-err');

const addMovie = (req, res, next) => {
  const data = { ...req.body, owner: req.user._id };
  return Movie.create(data)
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(new NotFoundError(err.message));
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const id = req.params._id;
  Movie.findById(id)
    .orFail(new NotFoundError('Нет фильма с таким id'))
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        movie.remove().then(() => res.send({ message: movie }));
      } else {
        next(new ForbiddenError('Недостаточно прав для удаления фильма'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

module.exports = { addMovie, getMovies, deleteMovie };
