import express, { type Router } from "express"
import asyncHandler from "express-async-handler"
import { validate, ValidationSource } from "../helpers/validators.ts"
import { apiKeySchema } from "./schema.ts"
import { ApiKeyHeader } from "./utils.ts"
import { ForbiddenError } from "../core/CustomErrorHandler.ts"
import ApiKeyModel from "../models/ApiKeyModel.ts"
import type { ApiKeyRequest } from "../types/request.ts"

const router: Router = express.Router()

router.use(
  validate(apiKeySchema, ValidationSource.HEADERS),
  asyncHandler(async (_req: ApiKeyRequest, _res, next) => {
    const xKeyHeader = _req.headers[ApiKeyHeader.API_KEY]
    if (!xKeyHeader) throw new ForbiddenError("Api Key is required")
    const apiKey = await ApiKeyModel.findOne({ key: xKeyHeader })
    if (!apiKey) throw new ForbiddenError("Api Key is invalid")

    _req.apiKey = apiKey
    next()
  }),
)

export default router
