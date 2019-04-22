const express = require('express');
const router = express.Router();
const { home, auth } = require('../controllers');

router.get('/', auth.authMiddleware, home.welcome);
router.put('/about', auth.authMiddleware, home.about);

module.exports = router;