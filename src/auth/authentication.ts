import express, { type Router } from "express"
import asyncHandler from "express-async-handler"
import { validate, ValidationSource } from "../helpers/validators.ts"
import schema from "./schema.ts"
import type { ApiKeyRequest } from "../types/request.ts"
import { ApiKeyHeader, getAccessToken, validateTokenData } from "./utils.ts"
import JWT from "../core/JWT.ts"
import User from "../models/userModel.ts"
import { UnauthorizedError } from "../core/CustomErrorHandler.ts"
import KeyStore from "../models/KeyStoreModel.ts"
import { ApiError } from "../core/ApiError.ts"
import { tokenInfo } from "../config.ts"

const router: Router = express.Router()

router.use(
  validate(schema.auth, ValidationSource.HEADERS),
  asyncHandler(async (_req: ApiKeyRequest, _res, next) => {
    const accTknWithBearer = _req.headers[ApiKeyHeader.API_AUTH]
    const accessToken = getAccessToken(accTknWithBearer) as string
    _req.accessToken = accessToken

    try {
      const decodedAccessToken = await JWT.decode(_req.accessToken)
      await JWT.validate(_req.accessToken, tokenInfo.secret)
      validateTokenData(decodedAccessToken)
      const userId = decodedAccessToken.sub
      const user = await User.findById(userId)
      if (!user) throw new UnauthorizedError("User not registered")
      _req.user = user

      const keyStore = await KeyStore.findOne({
        client: user,
        primaryKey: decodedAccessToken.prm,
        status: true,
      })

      if (!keyStore) throw new UnauthorizedError("KeyStore not found")
      _req.keyStore = keyStore
      next()
    } catch (error: any) {
      if (error instanceof ApiError) throw error
      throw new UnauthorizedError("Invalid access token")
    }
  }),
)

export default router
