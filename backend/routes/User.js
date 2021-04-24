const express = require ('express');
const router = express.Router();
const rateLimit = require('../middleware/limit');

const userCrl = require('../controllers/User');


router.post('/signup', userCrl.signup);
router.post('/login', rateLimit.limiter, userCrl.login);

module.exports = router;