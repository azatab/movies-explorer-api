const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET } = require('../config');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-req-err');
const ConflictError = require('../errors/conflict-err');
const UnautharizedError = require('../errors/unauth-err');

const addUser = (req, res, next) => {
  const data = { ...req.body };
  bcrypt.hash(data.password, 10)
    .then((hash) => User.create({
      email: data.email,
      password: hash,
      name: data.name,
    }))
    .then((user) => res.status(200).send({
      _id: user._id, email: user.email, name: user.name,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(`Пользователь с почтой ${data.email} уже существует!`);
      }
      next(err);
    })
    .catch(next);
};

const updateUserProfile = (req, res, next) => {
  const data = { ...req.body };
  return User.findByIdAndUpdate(
    req.user._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new ConflictError(`Пользователь с почтой ${data.email} уже существует!`);
      } if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные');
      } if (err.message === 'NotValidId') {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      }
      next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new UnautharizedError(err.message);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const id = req.user._id;

  User.findById(id)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      res.send(err);
    })
    .catch(next);
};

module.exports = {
  addUser, updateUserProfile, login, getCurrentUser,
};
