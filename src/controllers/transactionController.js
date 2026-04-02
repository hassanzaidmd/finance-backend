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
  // Advanced Features: Filtering, Search, and Pagination
  const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;
  
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM transactions WHERE isDeleted = 0';
  const params = [];

  // Filter by Type
  if (type) {
    query += ' AND type = ?';
    params.push(type.toUpperCase());
  }
  // Filter by Category
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  // Filter by Date Range
  if (startDate) {
    query += ' AND date >= ?';
    params.push(startDate);
  }
  if (endDate) {
    query += ' AND date <= ?';
    params.push(endDate);
  }
  // Keyword Search (Description or Category)
  if (search) {
    query += ' AND (description LIKE ? OR category LIKE ?)';
    const searchParam = `%${search}%`;
    params.push(searchParam, searchParam);
  }

  // Sorting and Pagination
  query += ' ORDER BY date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(query, params, (err, rows) => {
    if (err) {
      console.error('Database Get Transactions Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // Get total count for pagination metadata
    db.get('SELECT COUNT(*) as total FROM transactions WHERE isDeleted = 0', [], (err, result) => {
      res.json({
        data: rows,
        pagination: {
          total: result ? result.total : 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: result ? Math.ceil(result.total / limit) : 0
        }
      });
    });
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
    'UPDATE transactions SET amount = ?, type = ?, category = ?, date = ?, description = ? WHERE id = ? AND isDeleted = 0',
    [amount, type, category, date, description, id],
    function (err) {
      if (err) {
        console.error('Database Update Transaction Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found or deleted' });
      res.json({ id, ...result.data });
    }
  );
};

const deleteTransaction = (req, res) => {
  const { id } = req.params;
  const deletedAt = new Date().toISOString();

  // Professional Soft Delete Implementation
  db.run(
    'UPDATE transactions SET isDeleted = 1, deletedAt = ? WHERE id = ?',
    [deletedAt, id],
    function (err) {
      if (err) {
        console.error('Database Soft Delete Error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) return res.status(404).json({ error: 'Transaction not found' });
      res.json({ message: 'Transaction moved to trash (soft deleted)', id, deletedAt });
    }
  );
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
};
