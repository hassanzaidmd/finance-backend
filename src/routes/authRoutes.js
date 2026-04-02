const express = require('express');
const { login, register } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();

router.post('/login', login);

// Only ADMIN can register new users
router.post('/register', authMiddleware, authorize('ADMIN'), register);

module.exports = router;
