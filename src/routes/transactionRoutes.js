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
 *     summary: List transactions (Admin & Analyst only)
 *     tags: [Transactions]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [INCOME, EXPENSE] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: search
 *         description: Keyword search in description or category
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         description: Page number (default 1)
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         description: Number of records per page (default 10)
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: OK
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
 *           schema: { $ref: '#/components/schemas/TransactionInput' }
 *     responses:
 *       201: { description: Created }
 */
router.post('/', authMiddleware, authorize('ADMIN'), createTransaction);
/**
 * @openapi
 * /transactions/{id}:
 *   put:
 *     summary: Update transaction (Admin only)
 *     tags: [Transactions]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TransactionInput' }
 *     responses:
 *       200: { description: Updated }
 */
router.put('/:id', authMiddleware, authorize('ADMIN'), updateTransaction);


/**
 * @openapi
 * /transactions/{id}:
 *   delete:
 *     summary: Delete transaction (Admin only)
 *     tags: [Transactions]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Deleted }
 */
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteTransaction);



module.exports = router;
