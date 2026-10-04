import type { Response } from "express"

// ...existing code...
export enum ApiErrorType {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",
  ACCESS_TOKEN_ERROR = "ACCESS_TOKEN_ERROR",
  REFRESH_TOKEN_ERROR = "REFRESH_TOKEN_ERROR",
}

export class ApiError extends Error {
  public readonly type: ApiErrorType
  public readonly statusCode: number

  constructor(type: ApiErrorType, message: string, statusCode: number) {
    super(message)
    this.type = type
    this.statusCode = statusCode
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }

  static handle(error: ApiError, res: Response): ApiError {
    res.status(error.statusCode || 500).json({
      type: error.type || ApiErrorType.INTERNAL_SERVER_ERROR,
      message: error.message || "Internal Server Error",
    })
    return error
  }
}
