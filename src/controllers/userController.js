const { db } = require('../db/database');
const { z } = require('zod');

const userUpdateSchema = z.object({
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER']).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional()
});

const getUsers = (req, res) => {
  db.all('SELECT id, username, role, status, createdAt FROM users ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const result = userUpdateSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })) 
    });
  }

  const updates = result.data;
  const fields = Object.keys(updates);
  
  if (fields.length === 0) {
    return res.status(400).json({ error: 'No update data provided' });
  }

  const setClause = fields.map(field => `${field} = ?`).join(', ');
  const params = [...Object.values(updates), id];

  db.run(`UPDATE users SET ${setClause} WHERE id = ?`, params, function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User updated successfully', updates });
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves (optional but recommended)
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'You cannot delete your own admin account' });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  });
};

module.exports = {
  getUsers,
  updateUser,
  deleteUser
};
