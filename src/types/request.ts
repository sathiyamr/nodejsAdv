import type { Request } from "express"
import type { UserDocument } from "../models/userModel.ts"

export interface AuthRequest extends Request {
  user?: UserDocument
}
