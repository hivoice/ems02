import { z } from 'zod';

// Schema definitions using Zod for type safety and validation
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['admin', 'employee']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const employeeSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  departmentId: z.string().uuid(),
  positionId: z.string().uuid(),
  hireDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const departmentSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const positionSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  departmentId: z.string().uuid(),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof userSchema>;
export type Employee = z.infer<typeof employeeSchema>;
export type Department = z.infer<typeof departmentSchema>;
export type Position = z.infer<typeof positionSchema>;