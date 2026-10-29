import asyncHandler from "express-async-handler"
import type { RequestHandler } from "express"
import { readFile, unlink } from "node:fs/promises"
import { join } from "node:path"
import { PROFILE_PICTURES_DIR } from "../config/uploadPaths.ts"
import { BadRequestError, UnauthorizedError } from "../core/CustomErrorHandler.ts"
import logger from "../core/Logger.ts"
import ProfilePicture from "../models/profilePictureModel.ts"
import type { AuthRequest } from "../types/request.ts"

const hasValidImageSignature = async (filePath: string, mimeType: string) => {
  const file = await readFile(filePath)

  if (mimeType === "image/jpeg") {
    return file.length >= 3 && file[0] === 0xff && file[1] === 0xd8 && file[2] === 0xff
  }

  if (mimeType === "image/png") {
    return file.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  }

  return (
    mimeType === "image/webp" &&
    file.length >= 12 &&
    file.toString("ascii", 0, 4) === "RIFF" &&
    file.toString("ascii", 8, 12) === "WEBP"
  )
}

const uploadProfilePicture: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const file = req.file
  if (!file) {
    throw new BadRequestError("Profile picture file is required")
  }

  if (!req.user) {
    await unlink(file.path)
    throw new UnauthorizedError("Not authorized")
  }

  try {
    if (!(await hasValidImageSignature(file.path, file.mimetype))) {
      throw new BadRequestError("Uploaded file does not contain a valid image")
    }

    const existingPicture = await ProfilePicture.findOne({ user: req.user._id })
    const profilePicture = await ProfilePicture.findOneAndUpdate(
      { user: req.user._id },
      {
        user: req.user._id,
        filename: file.filename,
        mimeType: file.mimetype,
        size: file.size,
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    )

    if (existingPicture && existingPicture.filename !== file.filename) {
      try {
        await unlink(join(PROFILE_PICTURES_DIR, existingPicture.filename))
      } catch (error) {
        logger.error("Failed to remove replaced profile picture", error)
      }
    }

    res.status(200).json({
      profilePicture: {
        filename: profilePicture.filename,
        mimeType: profilePicture.mimeType,
        size: profilePicture.size,
        url: `/uploads/profile/${profilePicture.filename}`,
      },
    })
  } catch (error) {
    try {
      await unlink(file.path)
    } catch (cleanupError) {
      logger.error("Failed to remove rejected profile picture upload", cleanupError)
    }
    throw error
  }
})

export { uploadProfilePicture }
