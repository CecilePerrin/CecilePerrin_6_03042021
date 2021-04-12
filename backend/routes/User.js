const express = require ('express');
const router = express.Router();

const userCrl = require('../controllers/User')

router.post('/signup', userCrl.signup);
router.post('/login', userCrl.login);

module.exports = router;