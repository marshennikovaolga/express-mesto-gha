const mongoose = require('mongoose');
const Card = require('../models/card');

const constants = require('../utils/constants');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');

module.exports.addCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError());
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(200).send({ message: 'Карточка успешно удалена.' });
        })
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            next(new NotFoundError());
          } else if (err instanceof mongoose.Error.CastError) {
            next(new BadRequestError());
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NotFoundError());
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError();
    }

    const likedCard = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes']);

    if (likedCard.likes.includes(req.user._id)) {
      throw new BadRequestError(constants.LIKE_MESSAGE);
    }

    const likeReply = {
      message: 'Вы поставили лайк на карточку',
      likedCard,
    };

    res.status(200).send(likeReply);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findById(cardId);

    if (!card) {
      throw new NotFoundError();
    }

    const dislikedCard = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .populate(['owner', 'likes']);

    if (!dislikedCard.likes.includes(req.user._id)) {
      throw new BadRequestError(constants.DISLIKE_MESSAGE);
    }

    const dislikeReply = {
      message: 'Вы убрали лайк с карточки',
      dislikedCard,
    };

    res.status(200).send(dislikeReply);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};
