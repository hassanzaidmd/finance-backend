const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  });
};

const register = async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ error: 'Username, password, and role are required' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (user) return res.status(400).json({ error: 'Username already exists' });

    const hash = await bcrypt.hash(password, 10);
    db.run('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hash, role],
      function (err) {
        if (err) return res.status(500).json({ error: 'Database error' });
        res.status(201).json({ id: this.lastID, username, role });
      }
    );
  });
};

module.exports = { login, register };
