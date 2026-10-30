import { type NextFunction, type RequestHandler, type Response } from "express"
import type { Permission } from "../models/ApiKeyModel.ts"
import type { ApiKeyRequest } from "../types/request.ts"
import asyncHandler from "express-async-handler"
import { ForbiddenError } from "../core/CustomErrorHandler.ts"

export const permissionVaidation = (shouldHasPermission: Permission): RequestHandler => {
  return asyncHandler(async (req: ApiKeyRequest, _res: Response, next: NextFunction) => {
    const permissionList = req.apiKey?.permission
    if (!permissionList) {
      throw new ForbiddenError("Permission is not defined")
    }
    const hasPermission = permissionList.includes(shouldHasPermission)
    if (!hasPermission) {
      throw new ForbiddenError("Permission is not allowed")
    }
    next()
  })
}
