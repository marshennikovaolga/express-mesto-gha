class ForbiddenError extends Error {
  constructor(message = 'Вы не можете удалить карточку другого пользователя.') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
  }
}

module.exports = ForbiddenError;
