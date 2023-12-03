const jwt = require('jsonwebtoken');
const config = require('../config');
const InvalidCredentialsError = require('../errors/invalidCredentialsError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new InvalidCredentialsError('Необходимо авторизоваться.');
    }

    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, config.JWT_KEY);
    } catch (err) {
      throw new InvalidCredentialsError('Необходимо авторизоваться.');
    }

    req.user = payload;
    next();
  } catch (error) {
    next(error);
  }
};
