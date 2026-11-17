import type { NextFunction, Response } from "express"
import type { ROLES } from "../models/RoleModel.ts"
import type { RoleRequest } from "../types/request.ts"

export default (...roleCodes: ROLES[]) => {
  return (req: RoleRequest, _res: Response, next: NextFunction) => {
    req.currentRoleCodes = roleCodes
    next()
  }
}
