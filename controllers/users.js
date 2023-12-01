const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const BadRequestError = require('../errors/users/user400');
const NotFoundError = require('../errors/users/user404');
const ConflictError = require('../errors/users/user409');
const DefaultError = require('../errors/users/user500');

const User = require('../models/user');

module.exports.addUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError());
      } else if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getMyId = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => res.status(200).send(user))
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(next);
};

module.exports.getUserById = async (req, res, next) => {
  try {
    if (req.params.userId.length !== 24) {
      throw new BadRequestError();
    }
    const user = await User.findById(req.params.userId);
    if (!user) {
      throw new NotFoundError();
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

module.exports.editUserData = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    if (!req.user._id) {
      throw new DefaultError();
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError();
    });
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};

module.exports.editUserAvatar = async (req, res, next) => {
  try {
    if (!req.user._id) {
      throw new DefaultError();
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError();
    });
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};
