const BadRequestError = require('../errors/users/user400');
const NotFoundError = require('../errors/users/user404');
const DefaultError = require('../errors/users/user500');

const User = require('../models/user');

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(new BadRequestError().statusCode).send({
          message: new BadRequestError().errorMessage,
        });
      } else {
        res.status(new DefaultError().statusCode).send({
          message: new DefaultError().errorMessage,
        });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    }));
};

module.exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(new NotFoundError().statusCode).send({
        message: new NotFoundError().errorMessage,
      });
    }
    return res.send(user);
  } catch (err) {
    return res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    });
  }
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(new BadRequestError().statusCode).send({
            message: new BadRequestError().errorMessage,
          });
        } else {
          res.status(new NotFoundError().statusCode).send({
            message: new NotFoundError().errorMessage,
          });
        }
      });
  } else {
    res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    });
  }
};

module.exports.editUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      { new: true, runValidators: true },
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(new BadRequestError().statusCode).send({
            message: new BadRequestError().errorMessage,
          });
        } else {
          res.status(new NotFoundError().statusCode).send({
            message: new NotFoundError().errorMessage,
          });
        }
      });
  } else {
    res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    });
  }
};
