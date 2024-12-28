import { hashSync, compareSync } from 'bcryptjs';

const SALT_ROUNDS = 10;

export function hashPassword(password: string): string {
  if (!password) throw new Error('Password is required');
  return hashSync(password, SALT_ROUNDS);
}

export function comparePassword(plainPassword: string, hashedPassword: string): boolean {
  if (!plainPassword || !hashedPassword) return false;
  try {
    return compareSync(plainPassword, hashedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}