class DefaultError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DefaultError';
    this.statusCode = 500;
    this.errorMessage = 'На сервере произошла ошибка.';
  }
}

module.exports = DefaultError;
