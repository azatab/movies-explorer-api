const router = require('express').Router();
const { addUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateSignin, validateSignup } = require('../middlewares/req-validation');
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const NotFoundError = require('../errors/not-found-err');

router.post('/signin', validateSignin, login);
router.post('/signup', validateSignup, addUser);
router.use(auth);
router.use('/', usersRouter);
router.use('/', moviesRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
