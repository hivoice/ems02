export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'AUTH_ERROR'
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message = 'auth.invalidCredentials') {
    super(message, 'INVALID_CREDENTIALS');
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = 'auth.unauthorized') {
    super(message, 'UNAUTHORIZED');
  }
}

export class ValidationError extends AuthError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR');
  }
}