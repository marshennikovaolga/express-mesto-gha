const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const signupRouter = require('./signup');
const signinRouter = require('./signin');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/notFoundError');

router.use(auth);
router.use('/signup', signupRouter);
router.use('/signin', signinRouter);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError());
});

module.exports = router;
