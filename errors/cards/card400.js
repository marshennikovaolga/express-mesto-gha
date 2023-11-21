class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
    this.errorMessage = 'Переданы некорректные данные карточки.';
  }
}

module.exports = BadRequestError;
