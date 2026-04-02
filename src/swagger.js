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
            id: { type: 'integer' },
            amount: { type: 'number' },
            type: { type: 'string', enum: ['INCOME', 'EXPENSE'] },
            category: { type: 'string' },
            date: { type: 'string', format: 'date' },
            description: { type: 'string' },
            userId: { type: 'integer' },
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
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
