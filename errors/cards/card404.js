class NotFoundError extends Error {
  constructor(message = 'Карточка с указанным _id не найдена.') {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
