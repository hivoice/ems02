export const AUTH_ROUTES = {
  ADMIN: {
    LOGIN: '/login',
    DASHBOARD: '/admin/dashboard'
  },
  EMPLOYEE: {
    LOGIN: '/employee/login',
    DASHBOARD: '/employee/dashboard'
  }
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'auth.invalidCredentials',
  UNAUTHORIZED: 'auth.unauthorized',
  VALIDATION_ERROR: 'auth.validationError'
} as const;