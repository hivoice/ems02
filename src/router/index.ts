import { createRouter, createWebHistory } from 'vue-router';
import { adminGuard, employeeGuard } from './guards';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Admin routes
    {
      path: '/login',
      component: () => import('../views/admin/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      beforeEnter: adminGuard,
      children: [
        {
          path: '',
          redirect: '/admin/dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('../views/admin/DashboardView.vue')
        },
        {
          path: 'employees',
          component: () => import('../views/admin/employees/EmployeeListView.vue')
        },
        {
          path: 'departments',
          component: () => import('../views/admin/departments/DepartmentListView.vue')
        },
        {
          path: 'positions',
          component: () => import('../views/admin/positions/PositionListView.vue')
        },
        {
          path: 'attendance',
          component: () => import('../views/admin/attendance/AttendanceView.vue')
        },
        {
          path: 'salary',
          component: () => import('../views/admin/salary/SalaryListView.vue')
        },
        {
          path: 'settings',
          children: [
            {
              path: 'password',
              component: () => import('../views/admin/settings/PasswordView.vue')
            },
            {
              path: 'users',
              component: () => import('../views/admin/settings/UsersView.vue')
            }
          ]
        }
      ]
    },
    
    // Employee routes
    {
      path: '/employee/login',
      component: () => import('../views/employee/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/employee',
      component: () => import('../layouts/EmployeeLayout.vue'),
      meta: { requiresAuth: true },
      beforeEnter: employeeGuard,
      children: [
        {
          path: '',
          redirect: '/employee/dashboard'
        },
        {
          path: 'dashboard',
          component: () => import('../views/employee/DashboardView.vue')
        },
        {
          path: 'profile',
          component: () => import('../views/employee/ProfileView.vue')
        },
        {
          path: 'attendance',
          component: () => import('../views/employee/attendance/AttendanceView.vue')
        },
        {
          path: 'salary',
          component: () => import('../views/employee/salary/SalaryView.vue')
        }
      ]
    },
    
    // Default redirect
    {
      path: '/',
      redirect: '/login'
    }
  ]
});

export default router;