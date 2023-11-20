const BadRequestError = require('../errors/cards/card400');
const NotFoundError = require('../errors/cards/card404');
const DefaultError = require('../errors/cards/card500');

const Card = require('../models/card');

module.exports.addCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(new BadRequestError().statusCode).send({
        message: new BadRequestError().errorMessage,
      });
    } else {
      res.status(new DefaultError().statusCode).send({
        message: new DefaultError().errorMessage,
      });
    }
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    if (req.params.cardId.length === 24) {
      const card = await Card.findByIdAndDelete(req.params.cardId);
      if (!card) {
        res.status(new NotFoundError().statusCode).send({
          message: new NotFoundError().errorMessage,
        });
        return;
      }
      res.send({ message: 'Карточка успешно удалена.' });
    } else {
      res.status(new BadRequestError().statusCode).send({
        message: new BadRequestError().errorMessage,
      });
    }
  } catch (err) {
    res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    });
  }
};

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    if (cardId.length === 24) {
      const card = await Card.findById(cardId);

      if (!card) {
        res.status(new NotFoundError().statusCode).send({
          message: new NotFoundError().errorMessage,
        });
        return;
      }
      const updatedCard = await Card.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .populate(['owner', 'likes']);

      res.send(updatedCard);
    } else {
      res.status(new BadRequestError().statusCode).send({
        message: new BadRequestError().errorMessage,
      });
    }
  } catch (err) {
    res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    });
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    if (cardId.length === 24) {
      const card = await Card.findById(cardId);

      if (!card) {
        res.status(new NotFoundError().statusCode).send({
          message: new NotFoundError().errorMessage,
        });
        return;
      }
      const updatedCard = await Card.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } },
        { new: true },
      )
        .populate(['owner', 'likes']);

      res.send(updatedCard);
    } else {
      res.status(new BadRequestError().statusCode).send({
        message: new BadRequestError().errorMessage,
      });
    }
  } catch (err) {
    res.status(new DefaultError().statusCode).send({
      message: new DefaultError().errorMessage,
    });
  }
};
