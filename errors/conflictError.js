class ConflictError extends Error {
  constructor(message = 'Пользователь с таким email уже зарегистрирован.') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
  }
}

module.exports = ConflictError;
