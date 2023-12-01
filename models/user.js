const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const InvalidCredentialsError = require('../errors/users/user401');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'никнейм',
    minlength: [2, 'Минимальная длина поля - 2 символа'],
    maxlength: [30, 'Максимальная длина поля - 30 символов'],
  },
  about: {
    type: String,
    default: 'описание пользователя',
    minlength: [2, 'Минимальная длина поля - 2 символа'],
    maxlength: [30, 'Максимальная длина поля - 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Введите корректный URL.',
    },
  },
  email: {
    type: String,
    required: [true, 'Заполните поле'],
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Введите корректный email.',
    },
  },
  password: {
    type: String,
    required: [true, 'Заполните поле'],
    select: false,
  },
}, { versionKey: false });

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new InvalidCredentialsError('Ошибка в адресе электронной почты или пароле.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new InvalidCredentialsError('Ошибка в адресе электронной почты или пароле.');
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
