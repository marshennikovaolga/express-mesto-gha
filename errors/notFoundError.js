class NotFoundError extends Error {
  constructor(message = 'Запрашиваемый ресурс не найден.') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
