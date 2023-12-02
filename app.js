const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const globalError = require('./middlewares/global-error');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
mongoose.connect(DB_URL);

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use( '*', ( req, res ) => {
  res.stutus(404).send({ message: "Запрашиваемый ресурс не найден."});
});

app.use(errors());
app.use(globalError);

app.listen(PORT);
