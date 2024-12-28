import { create } from 'zustand';
import { userRepository } from '../lib/db/repositories/userRepository';
import { User } from '../lib/db/schema';
import { comparePassword, hashPassword } from '../lib/auth/password';

interface AuthState {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    const user = userRepository.findByEmail(email);
    if (!user || !await comparePassword(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    set({ user });
  },

  signUp: async (email: string, password: string) => {
    const hashedPassword = await hashPassword(password);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      role: 'employee'
    });
    set({ user });
  },

  signOut: () => {
    set({ user: null });
  },

  checkAuth: async () => {
    set({ loading: false, user: null });
  }
}));