import type { Request } from "express"
import type { UserDocument } from "../models/userModel.ts"
import type { ApiKeyDoc } from "../models/ApiKeyModel.ts"
import type { KeyStoreModel } from "../models/KeyStoreModel.ts"

export interface AuthRequest extends Request {
  user?: UserDocument
}

export interface ApiKeyRequest extends Request {
  keyStore?: KeyStoreModel
  accessToken?: string
  user?: UserDocument
}
