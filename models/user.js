const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Заполните поле'],
    minlength: [2, 'Минимальная длина поля - 2 символа'],
    maxlength: [30, 'Максимальная длина поля - 30 символов'],
  },
  about: {
    type: String,
    required: [true, 'Заполните поле'],
    minlength: [2, 'Минимальная длина поля - 2 символа'],
    maxlength: [30, 'Максимальная длина поля - 30 символов'],
  },
  avatar: {
    type: String,
    required: [true, 'Заполните поле'],
    validate: {
      validator: validator.isURL,
      message: 'Введите корректный URL',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
