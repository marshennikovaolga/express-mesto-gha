module.exports = {
  PORT: process.env.PORT || 3000,
  DB_URL: process.env.DB_URL || 'mongodb://127.0.0.1:27017/mestodb',
  JWT_KEY: process.env.JWT_KEY || 'secret-key',
};
