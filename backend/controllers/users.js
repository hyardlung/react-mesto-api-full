const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ConflictError = require('../errors/conflict-err');
const UnauthorizedError = require('../errors/unauthorized-err');

const SALT_ROUNDS = 10; // количество раундов хеширования
const MONGO_DUPLICATE_ERROR_CODE = 11000; // код ошибки при дублировании данных
const { NODE_ENV, JWT_SECRET } = process.env;

// РЕГИСТРАЦИЯ (создание пользователя, добавление в базу данных)
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      }
      if (err.name === 'MongoError' || err.code === MONGO_DUPLICATE_ERROR_CODE) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
    })
    .catch(next);
};

// АВТОРИЗАЦИЯ
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.cookie('mestoToken', token, {
        maxAge: 360000,
        httpOnly: true,
        sameSite: true,
      })
        .send({ _id: user._id });
    })
    .catch(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
};

// получение залогиненного пользователя
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким ID не найден');
      res.send(user);
    })
    .catch(next);
};

// получение пользователя из бд по ID
module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким ID не найден');
      return res.send(user);
    })
    .catch(next);
};

// получение всех пользователей из бд
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

// обновление данных пользователя
module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким ID не найден');
      res.send(user);
    })
    .catch(next);
};

// обновление аватара пользователя
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) throw new NotFoundError('Пользователь с таким ID не найден');
      return res.send(user);
    })
    .catch(next);
};
