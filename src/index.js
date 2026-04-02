const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const { initDb } = require('./db/database');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');





dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);
app.use('/dashboard', dashboardRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));




app.get('/', (req, res) => {

  res.json({ message: 'Welcome to Finance Management API' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Initialize database and start server
initDb().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Database initialization failed:', err);
  process.exit(1);
});
