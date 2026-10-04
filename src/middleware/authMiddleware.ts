import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import type { RequestHandler } from "express"
import User from "../models/userModel.ts"
import type { AuthRequest } from "../types/request.ts"
import { UnauthorizedError } from "../core/CustomErrorHandler.ts"

const protect: RequestHandler = asyncHandler(async (req, res, next) => {
  const authRequest = req as AuthRequest
  const token = authRequest.cookies.jwt

  if (token) {
    let decoded: { userId: string }

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
        userId: string
      }
    } catch {
      throw new UnauthorizedError("Not authorized, token failed")
    }

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      throw new UnauthorizedError("Not authorized, user not found")
    }

    authRequest.user = user
    next()
  } else {
    throw new UnauthorizedError("Not authorized, no token")
  }
})

export { protect }
