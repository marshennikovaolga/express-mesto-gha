class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = 404;
    this.errorMessage = 'Карточка с указанным _id не найдена.';
  }
}

module.exports = NotFoundError;
