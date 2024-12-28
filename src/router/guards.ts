import { NavigationGuard } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

export const adminGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.user || authStore.user.role !== 'admin') {
    next({ 
      path: '/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
};

export const employeeGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.user || authStore.user.role !== 'employee') {
    next({ 
      path: '/employee/login',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
};