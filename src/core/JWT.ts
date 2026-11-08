import { InternalServerError, InvalidTokenError, TokenExpiredError } from "./CustomErrorHandler.ts"
import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken"

export class JWTPayload {
  iss: string
  aud: string
  sub: string
  prm: string
  expiry: number
  iat: number
  constructor(issuer: string, audience: string, subject: string, param: string, validity: number) {
    this.iss = issuer
    this.aud = audience
    this.sub = subject
    this.prm = param
    this.iat = Math.floor(Date.now() / 1000)
    this.expiry = this.iat + validity
  }
}

function encode(payload: JWTPayload, secret: string): Promise<string> {
  if (!payload) throw new InternalServerError("Payload doesnt exist")
  if (!secret) throw new InternalServerError("Secret key doesnt exist")

  const options: SignOptions = { algorithm: "HS256" }

  return new Promise((resolve, reject) => {
    jwt.sign({ ...payload }, secret, options, (err, token) => {
      if (err) reject(new InternalServerError("Token Generation Failure"))
      if (token) resolve(token)
    })
  })
}

/**
 * Decodes the JWT token without verifying signature.
 * Useful to read the payload (e.g. user ID / keystore param) before fetching the secret.
 */
async function decode(token: string): Promise<JWTPayload> {
  if (!token) throw new InvalidTokenError("Token is required")
  try {
    const payload = jwt.decode(token) as JWTPayload | null
    if (!payload) throw new InvalidTokenError("Invalid token")
    return payload
  } catch (error) {
    throw new InvalidTokenError("Invalid token")
  }
}

async function validate(token: string, secret: string): Promise<JWTPayload> {
  if (!token) throw new InvalidTokenError("Token is required")
  if (!secret) throw new InternalServerError("Secret key is required")

  const options: VerifyOptions = { algorithms: ["HS256"] }

  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, options, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return reject(new TokenExpiredError("Token has expired"))
        }
        return reject(new InvalidTokenError("Invalid token signature"))
      }
      const payload = decoded as JWTPayload
      // Check custom expiry timestamp
      if (payload.expiry && payload.expiry < Math.floor(Date.now() / 1000)) {
        return reject(new TokenExpiredError("Token has expired"))
      }
      resolve(payload)
    })
  })
}

export { encode, decode, validate }
export default { encode, decode, validate }
