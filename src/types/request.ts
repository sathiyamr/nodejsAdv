import type { Request } from "express"
import type { UserDocument } from "../models/userModel.js"

export interface AuthRequest extends Request {
  user?: UserDocument
}
