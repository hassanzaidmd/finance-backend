const { db } = require('../db/database');

const getSummary = (req, res) => {
  const query = `
    SELECT 
      SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) as totalIncome,
      SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) as totalExpenses,
      COUNT(*) as transactionCount
    FROM transactions
  `;

  db.get(query, [], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    
    const summary = {
      totalIncome: row.totalIncome || 0,
      totalExpenses: row.totalExpenses || 0,
      netBalance: (row.totalIncome || 0) - (row.totalExpenses || 0),
      transactionCount: row.transactionCount
    };
    
    res.json(summary);
  });
};

const getCategoryTotals = (req, res) => {
  const query = `
    SELECT category, type, SUM(amount) as total
    FROM transactions
    GROUP BY category, type
    ORDER BY total DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
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
    GROUP BY month
    ORDER BY month ASC
  `;

  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getTrends
};
