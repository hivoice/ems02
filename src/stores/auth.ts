import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AuthenticatedUser } from '@/lib/auth/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthenticatedUser | null>(null);
  const loading = ref(true);

  async function signIn(authenticatedUser: AuthenticatedUser) {
    user.value = authenticatedUser;
    localStorage.setItem('user', JSON.stringify(authenticatedUser));
  }

  function signOut() {
    user.value = null;
    localStorage.removeItem('user');
  }

  async function checkAuth() {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        user.value = JSON.parse(savedUser);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      localStorage.removeItem('user');
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    loading,
    signIn,
    signOut,
    checkAuth
  };
});