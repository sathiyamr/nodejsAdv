import type { ErrorRequestHandler, RequestHandler } from "express"
import { ApiError } from "../core/ApiError.ts"
import { InternalServerError, NotFoundError } from "../core/CustomErrorHandler.ts"
import logger from "../core/Logger.ts"

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }

  if (err instanceof ApiError) {
    ApiError.handle(err, res)
    logger.error(err)
    return
  }

  if (err instanceof Error && err.name === "CastError") {
    ApiError.handle(new NotFoundError("Resource Not Found"), res)
    return
  }

  ApiError.handle(new InternalServerError(), res)
}

const notFound: RequestHandler = (req, res, next) => {
  const error = new NotFoundError(`Not Found: ${req.originalUrl}`)
  next(error)
}

export { errorHandler, notFound }
