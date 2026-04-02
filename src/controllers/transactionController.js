const { db } = require('../db/database');
const { transactionSchema } = require('../utils/validation');

const createTransaction = (req, res) => {
  const result = transactionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) 
    });
  }

  const { amount, type, category, date, description } = result.data;
  const userId = req.user.id;

  db.run(
    'INSERT INTO transactions (amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)',
    [amount, type, category, date, description, userId],
    function (err) {
      if (err) {
        console.error('Database Create Transaction Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: this.lastID, ...result.data, userId });
    }
  );
};

const getTransactions = (req, res) => {
  const { type, category, startDate, endDate } = req.query;
  let query = 'SELECT * FROM transactions WHERE 1=1';
  const params = [];

  if (type) {
    query += ' AND type = ?';
    params.push(type.toUpperCase());
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }

  query += ' ORDER BY date DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database Get Transactions Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(rows);
  });
};

const updateTransaction = (req, res) => {
  const { id } = req.params;
  const result = transactionSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) 
    });
  }

  const { amount, type, category, date, description } = result.data;

  db.run(
    'UPDATE transactions SET amount = ?, type = ?, category = ?, date = ?, description = ? WHERE id = ?',
    [amount, type, category, date, description, id],
    function (err) {
      if (err) {
        console.error('Database Update Transaction Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
      res.json({ id, ...result.data });
    }
  );
};

const deleteTransaction = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM transactions WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Database Delete Transaction Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  });
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
};
