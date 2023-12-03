const mongoose = require('mongoose');
const Card = require('../models/card');

const constants = require('../utils/constants');
const BadRequestError = require('../errors/badRequestError');
const ForbiddenError = require('../errors/forbiddenError');
const NotFoundError = require('../errors/notFoundError');

module.exports.addCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.status(201).send(card);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError());
    } else {
      next(err);
    }
  }
};

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.status(200).send(cards);
  } catch (err) {
    next(err);
  }
};

module.exports.deleteCard = async (req, res, next) => {
  try {
    if (req.params.cardId.length === 24) {
      const card = await Card.findById(req.params.cardId);

      if (!card) {
        next(new NotFoundError());
        return;
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }

      await Card.deleteOne(card)
        .orFail()
        .then(() => {
          res.status(200).send({ message: 'Карточка успешно удалена.' });
        })
        .catch(() => {
          next(new NotFoundError());
        });
    } else {
      next(new BadRequestError());
    }
  } catch (err) {
    next(err);
  }
};

module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    if (cardId.length === 24) {
      const card = await Card.findById(cardId);

      if (!card) {
        next(new NotFoundError());
        return;
      }
      if (card.likes.includes(req.user._id)) {
        next(new BadRequestError(constants.LIKE_MESSAGE));
        return;
      }

      const likedCard = await Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      ).populate(['owner', 'likes']);

      const likeReply = {
        message: 'Вы поставили лайк на карточку',
        likedCard,
      };
      res.status(200).send(likeReply);
    } else {
      next(new BadRequestError());
    }
  } catch (err) {
    next(err);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;
  try {
    if (cardId.length === 24) {
      const card = await Card.findById(cardId);

      if (!card) {
        next(new NotFoundError());
        return;
      }

      if (!card.likes.includes(req.user._id)) {
        next(new BadRequestError(constants.DISLIKE_MESSAGE));
        return;
      }

      const dislikedCard = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      ).populate(['owner', 'likes']);

      const dislikeReply = {
        message: 'Вы убрали лайк с карточки',
        dislikedCard,
      };
      res.status(200).send(dislikeReply);
    } else {
      next(new BadRequestError());
    }
  } catch (err) {
    next(err);
  }
};
