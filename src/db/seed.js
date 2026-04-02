const bcrypt = require('bcryptjs');
const { db, initDb } = require('./database');

const seed = async () => {
  await initDb();

  // Create Sample Users
  const users = [
    { username: 'admin', password: 'admin123', role: 'ADMIN' },
    { username: 'analyst', password: 'analyst123', role: 'ANALYST' },
    { username: 'viewer', password: 'viewer123', role: 'VIEWER' }
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    db.run(
      'INSERT OR IGNORE INTO users (username, password_hash, role) VALUES (?, ?, ?)',
      [user.username, hash, user.role]
    );
  }

  // Create Sample Transactions
  const transactions = [
    { amount: 5000, type: 'INCOME', category: 'Salary', date: '2026-03-01', description: 'March Salary' },
    { amount: 1500, type: 'EXPENSE', category: 'Rent', date: '2026-03-02', description: 'Monthly Rent' },
    { amount: 200, type: 'EXPENSE', category: 'Utilities', date: '2026-03-05', description: 'Electric & Water' },
    { amount: 100, type: 'EXPENSE', category: 'Food', date: '2026-03-10', description: 'Groceries' },
    { amount: 50, type: 'EXPENSE', category: 'Transport', date: '2026-03-12', description: 'Gas refill' },
    { amount: 300, type: 'INCOME', category: 'Freelance', date: '2026-03-15', description: 'Logo Design Project' },
    { amount: 120, type: 'EXPENSE', category: 'Food', date: '2026-03-18', description: 'Dinner out' },
    { amount: 5000, type: 'INCOME', category: 'Salary', date: '2026-04-01', description: 'April Salary' },
  ];

  db.serialize(() => {
    // Clear existing transactions to avoid duplicates during re-seed
    db.run('DELETE FROM transactions');
    
    const stmt = db.prepare('INSERT INTO transactions (amount, type, category, date, description, userId) VALUES (?, ?, ?, ?, ?, ?)');
    transactions.forEach(t => {
      stmt.run(t.amount, t.type, t.category, t.date, t.description, 1);
    });
    stmt.finalize();
    console.log('Seeded users (Admin, Analyst, Viewer) and 8 transactions');
  });
};

seed();
