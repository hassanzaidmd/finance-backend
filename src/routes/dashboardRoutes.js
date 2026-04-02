const express = require('express');
const {
  getSummary,
  getCategoryTotals,
  getTrends
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();

// All roles can view dashboard summaries and analytics
router.get('/summary', authMiddleware, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getSummary);
router.get('/categories', authMiddleware, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getCategoryTotals);
router.get('/trends', authMiddleware, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getTrends);

module.exports = router;
