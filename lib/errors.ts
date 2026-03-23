export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number = 500,
    public readonly code: string = 'INTERNAL_ERROR',
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message = 'Authentication required', cause?: unknown) {
    super(message, 401, 'AUTH_ERROR', cause);
    this.name = 'AuthError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Access denied', cause?: unknown) {
    super(message, 403, 'FORBIDDEN', cause);
    this.name = 'ForbiddenError';
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', cause?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', cause);
    this.name = 'ValidationError';
  }
}

export class DatabaseError extends AppError {
  constructor(message = 'Database operation failed', cause?: unknown) {
    super(message, 500, 'DATABASE_ERROR', cause);
    this.name = 'DatabaseError';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded', cause?: unknown) {
    super(message, 429, 'RATE_LIMIT', cause);
    this.name = 'RateLimitError';
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', cause?: unknown) {
    super(message, 404, 'NOT_FOUND', cause);
    this.name = 'NotFoundError';
  }
}
