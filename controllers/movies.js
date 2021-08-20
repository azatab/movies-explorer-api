const Movie = require('../models/movie');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const ForbiddenError = require('../errors/forbidden-err');

const addMovie = (req, res, next) => {
  const data = { ...req.body, owner: req.user._id };
  return Movie.create(data)
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      next(err);
    })
    .catch(next);
};

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const id = req.params._id;
  Movie.findById(id)
    .orFail(new Error('NotValidId'))
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        Movie.findByIdAndRemove(id)
          .then((deletedMovie) => {
            res.send(deletedMovie);
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new NotFoundError('Фильм с таким id не найдена!');
            }
            next(err);
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав для удаления фильма');
      }
      return res.status(200).send({ message: 'Фильм удалён' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет фильма с таким id');
      }
      next(err);
    })
    .catch(next);
};

const putLike = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет фильма с таким id');
      }
      next(err);
    })
    .catch(next);
};

const removeLike = (req, res, next) => {
  Movie.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('NotValidId'))
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } if (err.message === 'NotValidId') {
        throw new NotFoundError('Нет фильма с таким id');
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  addMovie, getMovies, deleteMovie, putLike, removeLike,
};
