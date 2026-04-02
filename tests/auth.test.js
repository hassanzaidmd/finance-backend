const request = require('supertest');
const express = require('express');
const authRoutes = require('../src/routes/authRoutes');
const { initDb, db } = require('../src/db/database');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

beforeAll(async () => {
  await initDb();
});

describe('Auth Endpoints', () => {
  it('should login with default admin credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'admin',
        password: process.env.ADMIN_INITIAL_PASSWORD || 'admin123'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });
});
