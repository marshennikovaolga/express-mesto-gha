class NotFoundError extends Error {
  constructor(message = 'Пользователь с указанным _id не найден.') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
