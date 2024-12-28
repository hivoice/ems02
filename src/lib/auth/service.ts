import { userRepository } from '../db/repositories/userRepository';
import { comparePassword, hashPassword } from './password';
import { validateLoginCredentials } from '../validation/auth';
import { InvalidCredentialsError, ValidationError } from '../errors/auth';
import type { IAuthService, AuthenticatedUser } from './types';
import { ADMIN_CREDENTIALS } from '@/constants/auth';
import { AUTH_ERRORS } from './constants';

class AuthService implements IAuthService {
  async authenticate(
    identifier: string, 
    password: string, 
    role?: 'admin' | 'employee'
  ): Promise<AuthenticatedUser> {
    try {
      // Admin authentication
      if (role === 'admin') {
        if (identifier === ADMIN_CREDENTIALS.id && password === ADMIN_CREDENTIALS.password) {
          return {
            id: 'admin',
            email: ADMIN_CREDENTIALS.id,
            role: 'admin'
          };
        }
        throw new InvalidCredentialsError(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      // Employee authentication
      const validation = validateLoginCredentials({ email: identifier, password });
      if (!validation.success) {
        throw new ValidationError(validation.error.issues[0]?.message || AUTH_ERRORS.VALIDATION_ERROR);
      }

      const user = await userRepository.findByEmail(validation.data.email);
      if (!user || user.role !== 'employee' || !user.active) {
        throw new InvalidCredentialsError(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      const isValid = await comparePassword(password, user.password);
      if (!isValid) {
        throw new InvalidCredentialsError(AUTH_ERRORS.INVALID_CREDENTIALS);
      }

      const { password: _, ...authenticatedUser } = user;
      return authenticatedUser;
    } catch (error) {
      console.error('Authentication error:', error);
      if (error instanceof ValidationError || error instanceof InvalidCredentialsError) {
        throw error;
      }
      throw new InvalidCredentialsError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }
  }

  async changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
    // Verify current password
    if (currentPassword !== ADMIN_CREDENTIALS.password) {
      throw new InvalidCredentialsError('settings.invalidCurrentPassword');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new ValidationError('validation.minLength');
    }

    // In a real application, this would update the password in a database
    // For this demo, we'll just update the constant (which will reset on page reload)
    ADMIN_CREDENTIALS.password = newPassword;
  }

  async changeEmployeePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new InvalidCredentialsError(AUTH_ERRORS.INVALID_CREDENTIALS);
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new InvalidCredentialsError('settings.invalidCurrentPassword');
    }

    if (newPassword.length < 6) {
      throw new ValidationError('validation.minLength');
    }

    const hashedPassword = hashPassword(newPassword);
    await userRepository.updatePassword(userId, hashedPassword);
  }
}

export const authService = new AuthService();