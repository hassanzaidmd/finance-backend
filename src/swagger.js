const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Management API',
      version: '1.0.0',
      description: 'A professional finance backend with RBAC, JWT Auth, and Dashboard Analytics.',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Transaction: {
          type: 'object',
          properties: {
            id: { type: 'integer', description: 'Auto-generated unique ID' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            category: { type: 'string' },
            date: { type: 'string', format: 'date' },
            description: { type: 'string' },
            userId: { type: 'integer', description: 'ID of the Admin who created this record' },
            createdAt: { type: 'string', format: 'date-time' }
          },
        },
        TransactionInput: {
          type: 'object',
          required: ['amount', 'type', 'category', 'date'],
          properties: {
            amount: { type: 'number', example: 125.50 },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'], example: 'EXPENSE' },
            category: { type: 'string', example: 'Utilities' },
            date: { type: 'string', format: 'date', example: '2026-04-02' },
            description: { type: 'string', example: 'Monthly electric bill' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                role: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
