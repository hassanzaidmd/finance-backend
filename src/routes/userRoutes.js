const express = require('express');
const {
  getUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users (Admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', authMiddleware, authorize('ADMIN'), getUsers);

/**
 * @openapi
 * /users/{id}:
 *   patch:
 *     summary: Update user (Role or Status) (Admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [ADMIN, ANALYST, VIEWER] }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *     responses:
 *       200: { description: User updated }
 */
router.patch('/:id', authMiddleware, authorize('ADMIN'), updateUser);

/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags: [Users]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: User deleted }
 */
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteUser);

module.exports = router;
