class InvalidCredentialsError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidCredentialsError';
    this.statusCode = 401;
    this.message = message;
  }
}

module.exports = InvalidCredentialsError;
