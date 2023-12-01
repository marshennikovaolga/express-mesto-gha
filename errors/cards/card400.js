class BadRequestError extends Error {
  constructor(message = 'Переданы некорректные данные карточки.') {
    super(message);
    this.name = 'BadRequestError';
    this.statusCode = 400;
  }
}

module.exports = BadRequestError;
