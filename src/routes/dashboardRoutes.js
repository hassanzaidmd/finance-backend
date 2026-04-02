const express = require('express');
const {
  getSummary,
  getCategoryTotals,
  getTrends
} = require('../controllers/dashboardController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/rbac');

const router = express.Router();

/**
 * @openapi
 * /dashboard/summary:
 *   get:
 *     summary: Get financial summary (Income, Expenses, Balance)
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/summary', authMiddleware, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getSummary);

/**
 * @openapi
 * /dashboard/categories:
 *   get:
 *     summary: Get totals by category
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/categories', authMiddleware, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getCategoryTotals);

/**
 * @openapi
 * /dashboard/trends:
 *   get:
 *     summary: Get monthly income/expense trends
 *     tags: [Dashboard]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/trends', authMiddleware, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getTrends);


module.exports = router;
