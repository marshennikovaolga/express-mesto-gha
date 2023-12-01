class DefaultError extends Error {
  constructor(message = 'На сервере произошла ошибка.') {
    super(message);
    this.name = 'DefaultError';
    this.statusCode = 500;
  }
}

module.exports = DefaultError;
