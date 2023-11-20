class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.errorMessage = 'Пользователь с указанным _id не найден.';
  }
}

module.exports = NotFoundError;
