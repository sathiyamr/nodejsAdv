import { ApiError, ApiErrorType } from "./ApiError.ts"

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad Request") {
    super(ApiErrorType.BAD_REQUEST, message, 400)
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Not Found") {
    super(ApiErrorType.NOT_FOUND, message, 404)
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(ApiErrorType.UNAUTHORIZED, message, 401)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(ApiErrorType.FORBIDDEN, message, 403)
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = "Internal Server Error") {
    super(ApiErrorType.INTERNAL_SERVER_ERROR, message, 500)
  }
}

export class ServiceUnavailableError extends ApiError {
  constructor(message: string = "Service Unavailable") {
    super(ApiErrorType.SERVICE_UNAVAILABLE, message, 503)
  }
}

export class TokenExpiredError extends ApiError {
  constructor(message: string = "Token Expired") {
    super(ApiErrorType.TOKEN_EXPIRED, message, 401)
  }
}

export class InvalidTokenError extends ApiError {
  constructor(message: string = "Invalid Token") {
    super(ApiErrorType.INVALID_TOKEN, message, 401)
  }
}

export class AccessTokenError extends ApiError {
  constructor(message: string = "Access Token Error") {
    super(ApiErrorType.ACCESS_TOKEN_ERROR, message, 401)
  }
}

export class RefreshTokenError extends ApiError {
  constructor(message: string = "Refresh Token Error") {
    super(ApiErrorType.REFRESH_TOKEN_ERROR, message, 401)
  }
}
