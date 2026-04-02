const { db } = require('../db/database');
const { transactionSchema, querySchema } = require('../utils/validation');

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
  // 1. Validate Query Parameters
  const result = querySchema.safeParse(req.query);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Invalid search parameters', 
      details: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) 
    });
  }

  const { type, category, startDate, endDate, search, page, limit } = result.data;
  
  const offset = (page - 1) * limit;
  let whereClause = 'WHERE isDeleted = 0';
  const queryParams = [];

  // Construct Filter Logic
  if (type) {
    whereClause += ' AND type = ?';
    queryParams.push(type.toUpperCase());
  }
  if (category) {
    whereClause += ' AND category = ?';
    queryParams.push(category);
  }
  if (startDate) {
    whereClause += ' AND date >= ?';
    queryParams.push(startDate);
  }
  if (endDate) {
    whereClause += ' AND date <= ?';
    queryParams.push(endDate);
  }
  if (search) {
    whereClause += ' AND (description LIKE ? OR category LIKE ?)';
    const searchParam = `%${search}%`;
    queryParams.push(searchParam, searchParam);
  }

  // 2. Fetch Filtered Data
  const dataQuery = `SELECT * FROM transactions ${whereClause} ORDER BY date DESC LIMIT ? OFFSET ?`;
  const dataParams = [...queryParams, limit, offset];

  db.all(dataQuery, dataParams, (err, rows) => {
    if (err) {
      console.error('Database Get Transactions Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // 3. Get Total Count (Using the EXACT same filters)
    const countQuery = `SELECT COUNT(*) as total FROM transactions ${whereClause}`;
    
    db.get(countQuery, queryParams, (err, countResult) => {
      const total = countResult ? countResult.total : 0;
      res.json({
        data: rows,
        pagination: {
          total: total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
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
