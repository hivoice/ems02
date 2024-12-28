export const ADMIN_CREDENTIALS = {
  id: 'admin',
  password: 'admin123'
} as const;

export const AUTH_ROLES = {
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
} as const;

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'auth.invalidCredentials',
  UNAUTHORIZED: 'auth.unauthorized',
  VALIDATION_ERROR: 'auth.validationError'
} as const;