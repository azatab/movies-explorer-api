const jwt = require('jsonwebtoken');
const UnautharizedError = require('../errors/unauth-err');

const { JWT_SECRET } = require('../config');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautharizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnautharizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};
