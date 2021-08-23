const router = require('express').Router();

const { validateMovie, validateId } = require('../middlewares/req-validation');
const { addMovie, getMovies, deleteMovie } = require('../controllers/movies');

router.post('/movies', validateMovie, addMovie);
router.get('/movies', getMovies);
router.delete('/movies/:_id', validateId, deleteMovie);

module.exports = router;
