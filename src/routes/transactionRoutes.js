const express = require('express');
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();

/**
 * @openapi
 * /transactions:
 *   get:
 *     summary: List all transactions (Admin/Analyst only)
 *     tags: [Transactions]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *     responses:
 *       200:
 *         content:
 *           application/json:
 *             schema: { type: array, items: { $ref: '#/components/schemas/Transaction' } }
 */
router.get('/', authMiddleware, authorize(['ADMIN', 'ANALYST']), getTransactions);

/**
 * @openapi
 * /transactions:
 *   post:
 *     summary: Create transaction (Admin only)
 *     tags: [Transactions]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/Transaction' }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', authMiddleware, authorize('ADMIN'), createTransaction);
router.put('/:id', authMiddleware, authorize('ADMIN'), updateTransaction);
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteTransaction);


module.exports = router;
