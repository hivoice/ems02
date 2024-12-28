import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { authService } from '@/lib/auth/service';
import { AUTH_ROUTES } from '@/lib/auth/constants';

export function useAuth() {
  const store = useAuthStore();
  const router = useRouter();
  const { user } = storeToRefs(store);
  const error = ref<string | null>(null);
  const isLoading = ref(false);

  async function login(identifier: string, password: string, role?: 'admin' | 'employee') {
    if (isLoading.value) return;
    
    error.value = null;
    isLoading.value = true;
    
    try {
      const authenticatedUser = await authService.authenticate(identifier, password, role);
      await store.signIn(authenticatedUser);
      
      // Redirect based on user role
      const redirectPath = authenticatedUser.role === 'admin' 
        ? AUTH_ROUTES.ADMIN.DASHBOARD
        : AUTH_ROUTES.EMPLOYEE.DASHBOARD;
      router.push(redirectPath);
    } catch (err: any) {
      error.value = err?.message || 'auth.invalidCredentials';
      console.error('Login failed:', err);
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    const role = user.value?.role;
    store.signOut();
    router.push(role === 'admin' ? AUTH_ROUTES.ADMIN.LOGIN : AUTH_ROUTES.EMPLOYEE.LOGIN);
  }

  return {
    user,
    error,
    isLoading,
    login,
    logout
  };
}