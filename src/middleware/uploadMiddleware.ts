import multer from "multer"
import { mkdirSync } from "node:fs"
import { randomUUID } from "node:crypto"
import { PROFILE_PICTURES_DIR } from "../config/uploadPaths.ts"
import { BadRequestError } from "../core/CustomErrorHandler.ts"

const upload = multer()

const allowedImageTypes = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
])

mkdirSync(PROFILE_PICTURES_DIR, { recursive: true })

const profilePictureUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, PROFILE_PICTURES_DIR),
    filename: (_req, file, callback) => {
      const extension = allowedImageTypes.get(file.mimetype)
      if (!extension) {
        callback(new BadRequestError("Profile picture must be a JPEG, PNG, or WebP image"), "")
        return
      }
      callback(null, `${randomUUID()}${extension}`)
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      callback(new BadRequestError("Profile picture must be a JPEG, PNG, or WebP image"))
      return
    }

    callback(null, true)
  },
})

export { profilePictureUpload }
export default upload
