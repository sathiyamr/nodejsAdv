import type { Request } from "express"
import type { UserDoc } from "../models/userModel.ts"
import type { ApiKeyDoc } from "../models/ApiKeyModel.ts"
import type { KeyStoreDoc } from "../models/KeyStoreModel.ts"
import type { RoleDoc, ROLES } from "../models/RoleModel.ts"

export interface AuthRequest extends Request {
  user?: UserDoc
}

export interface ApiKeyRequest extends Request {
  keyStore?: KeyStoreDoc
  accessToken?: string
  user?: UserDoc
  apiKey?: ApiKeyDoc
}

export interface RoleRequest extends ApiKeyRequest {
  currentRoleCodes?: ROLES[]
}
