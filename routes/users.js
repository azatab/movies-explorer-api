const router = require('express').Router();
const { validateUpdatedata } = require('../middlewares/req-validation');
const { updateUserProfile, getCurrentUser } = require('../controllers/users');

router.get('/users/me', getCurrentUser);
router.patch('/users/me', validateUpdatedata, updateUserProfile);

module.exports = router;
