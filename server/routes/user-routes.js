const express = require('express');
const router = express.Router();
const { users, auth } = require('../controllers');

router.get('/', auth.authMiddleware, users.profile);
router.put('/:id', auth.authMiddleware, users.updateProfile);

module.exports = router;