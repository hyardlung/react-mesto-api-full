const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// получение всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

// удаление карточки по ID
module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  // поиск карточки и проверка её ID на соответствие ID пользователя
  Card.findById(cardId)
    .orFail(new NotFoundError('Такой карточки не существует'))
    .then((card) => {
      if (card.owner.toString() !== userId) {
        throw new ForbiddenError('В доступе отказано');
      }
      // поиск и удаление карточки
      return Card.findByIdAndRemove(cardId)
        .then(() => res.send({ message: 'Карточка успешно удалена' }));
    })
    .catch(next);
};

// лайк карточки
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Такой карточки не существует'))
    .then((card) => res.send(card))
    .catch(next);
};

// дизлайк карточки
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Такой карточки не существует'))
    .then((card) => res.send(card))
    .catch(next);
};
