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

// Only Admin and Analyst can view individual raw transactions
router.get('/', authMiddleware, authorize(['ADMIN', 'ANALYST']), getTransactions);

// Only ADMIN can manage transactions
router.post('/', authMiddleware, authorize('ADMIN'), createTransaction);
router.put('/:id', authMiddleware, authorize('ADMIN'), updateTransaction);
router.delete('/:id', authMiddleware, authorize('ADMIN'), deleteTransaction);

module.exports = router;
