const { z } = require('zod');

const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  description: z.string().optional()
});

const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

const registerSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'ANALYST', 'VIEWER'])
});

module.exports = {
  transactionSchema,
  loginSchema,
  registerSchema
};
