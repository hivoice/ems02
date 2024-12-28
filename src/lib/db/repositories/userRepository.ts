import { getDB } from '../client';
import type { User } from '@/types';
import { generateId } from '@/lib/utils/ids';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    if (!email) return null;
    
    try {
      const db = await getDB();
      const user = await db
        .transaction('users', 'readonly')
        .objectStore('users')
        .index('by-email')
        .get(email.toLowerCase());
      
      return user || null;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async createWithHashedPassword(data: { 
    email: string; 
    hashedPassword: string; 
    role: 'admin' | 'employee';
    active?: boolean;
  }): Promise<User> {
    if (!data.email || !data.hashedPassword) {
      throw new Error('Invalid user data');
    }

    const db = await getDB();
    const now = new Date().toISOString();
    
    const user = {
      id: generateId(),
      email: data.email.toLowerCase(),
      password: data.hashedPassword,
      role: data.role,
      active: data.active ?? true,
      created_at: now,
      updated_at: now
    };
    
    try {
      const tx = db.transaction('users', 'readwrite');
      await tx.objectStore('users').add(user);
      await tx.done;
      return user;
    } catch (error: any) {
      console.error('Error creating user:', error);
      if (error.name === 'ConstraintError') {
        throw new Error('User already exists');
      }
      throw new Error('Failed to create user');
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await getDB();
      const tx = db.transaction('users', 'readwrite');
      await tx.objectStore('users').clear();
      await tx.done;
    } catch (error) {
      console.error('Error clearing users:', error);
      throw error;
    }
  }

  async getDB() {
    return getDB();
  }
}

export const userRepository = new UserRepository();