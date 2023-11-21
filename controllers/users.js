const BadRequestError = require('../errors/users/user400');
const NotFoundError = require('../errors/users/user404');
const DefaultError = require('../errors/users/user500');

const badRequestError = new BadRequestError();
const notFoundError = new NotFoundError();
const defaultError = new DefaultError();

const User = require('../models/user');

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(badRequestError.statusCode).send({
          message: badRequestError.errorMessage,
        });
      } else {
        res.status(defaultError.statusCode).send({
          message: defaultError.errorMessage,
        });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(defaultError.statusCode).send({
      message: defaultError.errorMessage,
    }));
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (user) {
      return res.send(user);
    } else {
      return res.status(notFoundError.statusCode).send({
        message: notFoundError.errorMessage,
      });
    }
  } catch (err) {
    return res.status(defaultError.statusCode).send({
      message: defaultError.errorMessage,
    });
  }
};

module.exports.editUserData = async (req, res) => {
  try {
    const { name, about } = req.body;
    if (!req.user._id) {
      res.status(defaultError.statusCode).send({
        message: defaultError.errorMessage,
      });
      return;
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw res.status(notFoundError.statusCode).send({
        message: notFoundError.errorMessage,
      });
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(badRequestError.statusCode).send({
        message: badRequestError.errorMessage,
      });
    } else {
      res.status(defaultError.statusCode).send({
        message: defaultError.errorMessage,
      });
    }
  }
};

module.exports.editUserAvatar = async (req, res) => {
  try {
    if (!req.user._id) {
      res.status(defaultError.statusCode).send({
        message: defaultError.errorMessage,
      });
      return;
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw res.status(notFoundError.statusCode).send({
        message: notFoundError.errorMessage,
      });
    });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(badRequestError.statusCode).send({
        message: badRequestError.errorMessage,
      });
    } else {
      res.status(defaultError.statusCode).send({
        message: defaultError.errorMessage,
      });
    }
  }
};
