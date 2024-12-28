import { userRepository } from '../db/repositories/userRepository';
import { hashPassword } from '../auth/password';
import type { User } from '@/types';

class UserService {
  async getAllUsers(): Promise<User[]> {
    try {
      const db = await userRepository.getDB();
      const tx = db.transaction('users', 'readonly');
      const users = await tx.store.getAll();
      return users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        active: user.active ?? true
      }));
    } catch (error) {
      console.error('Error getting users:', error);
      return [];
    }
  }

  async createUser(data: { 
    email: string; 
    password: string; 
    role: 'admin' | 'employee' 
  }): Promise<User> {
    const hashedPassword = hashPassword(data.password);
    return userRepository.createWithHashedPassword({
      email: data.email,
      hashedPassword,
      role: data.role,
      active: true
    });
  }

  async updateUserRole(userId: string, newRole: 'admin' | 'employee'): Promise<void> {
    try {
      const db = await userRepository.getDB();
      const tx = db.transaction('users', 'readwrite');
      const user = await tx.store.get(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Prevent modifying admin role
      if (user.role === 'admin') {
        throw new Error('Cannot modify admin role');
      }

      user.role = newRole;
      user.updated_at = new Date().toISOString();
      await tx.store.put(user);
      await tx.done;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }

  async updateUserStatus(userId: string, active: boolean): Promise<void> {
    try {
      const db = await userRepository.getDB();
      const tx = db.transaction('users', 'readwrite');
      const user = await tx.store.get(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Prevent blocking admin users
      if (user.role === 'admin') {
        throw new Error('Cannot modify admin status');
      }

      user.active = active;
      user.updated_at = new Date().toISOString();
      await tx.store.put(user);
      await tx.done;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  async resetUserPassword(userId: string): Promise<string> {
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = hashPassword(newPassword);
    
    try {
      const db = await userRepository.getDB();
      const tx = db.transaction('users', 'readwrite');
      const user = await tx.store.get(userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      // Prevent resetting admin password
      if (user.role === 'admin') {
        throw new Error('Cannot reset admin password');
      }

      user.password = hashedPassword;
      user.updated_at = new Date().toISOString();
      await tx.store.put(user);
      await tx.done;
      return newPassword;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }
}

export const userService = new UserService();