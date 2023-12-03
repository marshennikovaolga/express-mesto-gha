const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errors } = require('celebrate');
const config = require('./config');
const globalError = require('./middlewares/global-error');

const { PORT, DB_URL } = config;

const app = express();
mongoose.connect(DB_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', require('./routes/index'));

app.use(errors());
app.use(globalError);

app.listen(PORT);
