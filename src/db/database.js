const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbPath = path.resolve(__dirname, '../../finance.db');
const db = new sqlite3.Database(dbPath);

const initDb = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users Table
      db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('ADMIN', 'ANALYST', 'VIEWER')),
        status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE')),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Transactions Table
      db.run(`CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount REAL NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('INCOME', 'EXPENSE')),
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        description TEXT,
        userId INTEGER,
        isDeleted INTEGER DEFAULT 0,
        deletedAt TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id)
      )`);

      // 🛡️ AUTO-MIGRATION: Ensure soft-delete columns exist in every instance
      db.run("ALTER TABLE transactions ADD COLUMN isDeleted INTEGER DEFAULT 0", (err) => {
        // We ignore "duplicate column name" error
        if (err && !err.message.includes('duplicate column')) {
          console.error('Migration isDeleted Error:', err.message);
        }
      });
      
      db.run("ALTER TABLE transactions ADD COLUMN deletedAt TEXT", (err) => {
        if (err && !err.message.includes('duplicate column')) {
          console.error('Migration deletedAt Error:', err.message);
        }
      });

      // Default Admin User
      const adminUsername = 'admin';
      const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';
      
      db.get("SELECT * FROM users WHERE username = ?", [adminUsername], async (err, row) => {
        if (err) return reject(err);
        if (!row) {
          const hash = await bcrypt.hash(adminPass, 10);
          db.run("INSERT INTO users (username, password_hash, role) VALUES (?, ?, 'ADMIN')", 
            [adminUsername, hash], 
            (err) => {
              if (err) reject(err);
              else {
                console.log('Default admin user created: admin /', adminPass);
                resolve();
              }
            }
          );
        } else {
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initDb };
