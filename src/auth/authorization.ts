import express, { type Router } from "express"
import asyncHandler from "express-async-handler"
import type { RoleRequest } from "../types/request.ts"
import { ForbiddenError } from "../core/CustomErrorHandler.ts"
import RoleModel from "../models/RoleModel.ts"

const router: Router = express.Router()

router.use(
  asyncHandler(async (_req: RoleRequest, _res, next) => {
    if (!_req.user || !_req.user.roles || !_req.currentRoleCodes) {
      throw new ForbiddenError("Access denied: insufficient permissions")
    }

    const currentRoles = await RoleModel.find({
      code: { $in: _req.currentRoleCodes },
      status: true,
    })
    let authorized = false
    for (const role of _req.user.roles) {
      if (authorized) break
      for (const currentRole of currentRoles) {
        if (currentRole._id.equals(role)) {
          authorized = true
          break
        }
      }
    }

    if (!authorized) {
      throw new ForbiddenError("Permission Denied")
    }

    return next()
  }),
)

export default router
