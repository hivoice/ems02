import type { User } from '@/types';

export type AuthenticatedUser = Omit<User, 'password'>;

export interface IAuthService {
  authenticate(email: string, password: string, role?: 'admin' | 'employee'): Promise<AuthenticatedUser>;
  changeAdminPassword(currentPassword: string, newPassword: string): Promise<void>;
  changeEmployeePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
}