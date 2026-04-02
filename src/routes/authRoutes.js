const express = require('express');
const { login, register } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: User Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AuthResponse' }
 */
router.post('/login', login);

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user (Admin only)
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password, role]
 *             properties:
 *               username: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [ADMIN, ANALYST, VIEWER] }
 *     responses:
 *       201:
 *         description: User created
 */
router.post('/register', authMiddleware, authorize('ADMIN'), register);


module.exports = router;
