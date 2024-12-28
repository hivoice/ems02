import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('auth.invalidEmail'),
  password: z.string().min(6, 'auth.passwordTooShort'),
  role: z.enum(['admin', 'employee'])
});

export type UserFormData = z.infer<typeof userSchema>;

export function validateUserData(data: unknown) {
  return userSchema.safeParse(data);
}

export function generateRandomPassword(length = 8): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}

export function formatUserRole(role: string, t: (key: string) => string): string {
  return t(`common.${role}`);
}

export function formatUserStatus(active: boolean, t: (key: string) => string): string {
  return t(active ? 'common.active' : 'common.inactive');
}