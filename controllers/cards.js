const Card = require('../models/card');

module.exports.addCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    const data = await Card.findById(card._id).populate('owner');
    res.send(data);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
    } else {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    }
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.deleteCard = async (req, res) => {
  try {
    if (req.params.cardId.length === 24) {
      const card = await Card.findByIdAndDelete(req.params.cardId);
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }
      res.send({ message: 'Карточка успешно удалена.' });
    } else {
      res.status(400).send({ message: 'Некорректный id карточки.' });
    }
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    if (cardId.length === 24) {
      const card = await Card.findById(cardId);

      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
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
      res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
    }
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка.' });
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    if (cardId.length === 24) {
      const card = await Card.findById(cardId);

      if (!card) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
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
      res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
    }
  } catch (err) {
    res.status(500).send({ message: 'На сервере произошла ошибка.' });
  }
};
