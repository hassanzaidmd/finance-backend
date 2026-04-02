const { db } = require('../db/database');

const getSummary = (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as totalIncome,
      SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as totalExpenses,
      COUNT(*) as transactionCount
    FROM transactions
    WHERE isDeleted = 0
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      console.error('Database Dashboard Summary Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    const summary = {
      totalIncome: row ? (row.totalIncome || 0) : 0,
      totalExpenses: row ? (row.totalExpenses || 0) : 0,
      netBalance: row ? ((row.totalIncome || 0) - (row.totalExpenses || 0)) : 0,
      transactionCount: row ? (row.transactionCount || 0) : 0
    };
    
    res.json(summary);
  });
};

const getCategoryTotals = (req, res) => {
  const query = `
    SELECT category, type, SUM(amount) as total
    FROM transactions
    WHERE isDeleted = 0
    GROUP BY category, type
    ORDER BY total DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database Category Totals Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

const getTrends = (req, res) => {
  const query = `
    SELECT 
      strftime('%Y-%m', date) as month,
      SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as income,
      SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as expense
    FROM transactions
    WHERE isDeleted = 0
    GROUP BY month
    ORDER BY month ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database Dashboard Trends Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getTrends
};
