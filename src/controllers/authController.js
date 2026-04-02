const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');
const { loginSchema, registerSchema } = require('../utils/validation');

const login = async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) 
    });
  }

  const { username, password } = result.data;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      console.error('Database Login Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    // Check account status
    if (user.status === 'INACTIVE') {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Your account has been deactivated. Please contact the administrator for support.' 
      });
    }

    const token = jwt.sign(

      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
};

const register = async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) 
    });
  }

  const { username, password, role } = result.data;

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) {
      console.error('Database Find User Error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    if (user) return res.status(400).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hash, role],
      function (err) {
        if (err) {
          console.error('Database Register Error:', err);
          return res.status(500).json({ error: err.message || 'Database error' });
        }
        res.status(201).json({ id: this.lastID, username, role });
      }
    );
  });
};

module.exports = { login, register };
