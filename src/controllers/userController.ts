import crypto from "crypto"
import User from "../models/userModel.ts"
import asyncHandler from "express-async-handler"
import type { RequestHandler } from "express"
import generateToken from "../utils/generateToken.ts"
import ProfilePicture from "../models/profilePictureModel.ts"
import { BadRequestError, UnauthorizedError } from "../core/CustomErrorHandler.ts"
import { createKeyStore } from "./KeyStoreController.ts"
import { createTokens } from "../auth/utils.ts"

const loginUser: RequestHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    // Commenting out the below fn
    // generateToken(res, user._id)

    // Create the AccessTokenKey and RefreshTokenKey from crypto
    const accessTokenKey = crypto.randomBytes(32).toString("hex")
    const refreshTokenKey = crypto.randomBytes(32).toString("hex")

    // we need to store this in key store and for that we can make use of the controller
    await createKeyStore(user, accessTokenKey, refreshTokenKey)

    // now we need to call createTokens from the utils
    const { accessToken, refreshToken } = await createTokens(user, accessTokenKey, refreshTokenKey)

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, //1 day
    })

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, //30days
    })

    const profilePicture = await ProfilePicture.findOne({ user: user._id }).select("filename")
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: profilePicture ? `/uploads/profile/${profilePicture.filename}` : null,
    })
  } else {
    throw new UnauthorizedError("Invalid email or password")
  }
})

const registerUser: RequestHandler = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    throw new BadRequestError("User already Exists")
  }

  const user = await User.create({ name, email, password })

  if (user) {
    generateToken(res, user._id)
    const profilePicture = await ProfilePicture.findOne({ user: user._id }).select("filename")
    res.status(201)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      profilePicture: profilePicture ? `/uploads/profile/${profilePicture.filename}` : null,
    })
  } else {
    throw new BadRequestError("Invalid User Credentials")
  }
})

// const forgotPassword = asyncHandler(async (req, res) => {
//   const { email } = req.body

//   const user = await User.findOne({ email })

//   if (!user) {
//     res.status(404)
//     throw new Error("User Not Found")
//   }

//   const resetToken = user.createPasswordResetToken()
//   user.save()

//   const resetUrl = `${req.protocol}://localhost:3000/reset-password/${resetToken}`

//   const message = `Forgot Password? Click on this this link to reset your Password: ${resetUrl}`

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Your Password reset token. (valid for 10mins)",
//       message,
//     })

//     res.status(200).json({
//       message: "Token Sent to email!",
//     })
//   } catch (error) {
//     user.passwordResetToken = undefined
//     user.passwordResetExpires = undefined
//     user.save()
//     console.log(error)

//     res.status(500).json({
//       status: "error",
//       message:
//         "There was an error in sending the email. Please Try again later",
//     })
//   }
// })

// const resetPassword = asyncHandler(async (req, res) => {
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.resetToken)
//     .digest("hex")

//   const user = await User.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   })

//   if (!user) {
//     res.status(400).json({
//       status: "fail",
//       message: "Token is invalid or has expired",
//     })
//   }

//   user.password = req.body.password
//   user.passwordResetToken = undefined
//   user.passwordResetExpires = undefined
//   user.save()

//   generateToken(res, user._id)

//   res.json({
//     _id: user._id,
//     name: user.name,
//     email: user.email,
//     isAdmin: user.isAdmin,
//   })
// })

const logoutUser: RequestHandler = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  })
  res.status(200).json({
    message: "Logged Out Successfully",
  })
})

export { loginUser, registerUser, logoutUser }
