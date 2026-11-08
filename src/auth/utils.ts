import { tokenInfo } from "../config.ts"
import {
  BadRequestError,
  InternalServerError,
  InvalidTokenError,
} from "../core/CustomErrorHandler.ts"
import JWT, { JWTPayload } from "../core/JWT.ts"
import type { UserDocument } from "../models/userModel.ts"

export enum ApiKeyHeader {
  API_KEY = "x-api-key",
  API_AUTH = "authorization",
}

export async function createTokens(
  user: UserDocument,
  accessTokenKey: string,
  refreshTokenKey: string,
) {
  const accessToken = await JWT.encode(
    new JWTPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      accessTokenKey,
      tokenInfo.accessTokenValidity,
    ),
    tokenInfo.secret,
  )

  const refreshToken = await JWT.encode(
    new JWTPayload(
      tokenInfo.issuer,
      tokenInfo.audience,
      user._id.toString(),
      refreshTokenKey,
      tokenInfo.refreshTokenValidity,
    ),
    tokenInfo.secret,
  )

  return { accessToken, refreshToken }
}

export function getAccessToken(authorization?: string) {
  if (!authorization) {
    throw new BadRequestError("Invalid Authorization Error")
  }
  if (!authorization.startsWith("Bearer ")) {
    throw new BadRequestError("Invalid Authorization Error")
  }
  return authorization.split(" ")[1]
}

export const validateTokenData = (payload: JWTPayload): boolean => {
  if (
    !payload ||
    !payload.iss ||
    !payload.sub ||
    !payload.aud ||
    !payload.prm ||
    payload.iss !== tokenInfo.issuer ||
    payload.aud !== tokenInfo.audience
  ) {
    throw new InvalidTokenError("Invalid token data")
  }
  return true
}
