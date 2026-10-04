import type { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { BadRequestError } from "../core/CustomErrorHandler.ts"

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
  HEADERS = "headers",
}

export const validate = (schema: z.ZodType, source: ValidationSource = ValidationSource.BODY) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const data = req[source]
    const result = schema.safeParse(data)
    if (!result.success) {
      const messages = result.error.issues.map((issue) => {
        const field = issue.path.map(String).join(".") || "request"
        const message =
          issue.code === "invalid_type" && issue.input === undefined ? "is required" : issue.message

        return `${field}: ${message}`
      })
      return next(new BadRequestError(messages.join(", ")))
    }
    req[source] = result.data
    next()
  }
}
