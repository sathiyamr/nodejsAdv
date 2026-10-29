import express, { type Router } from "express"
import { uploadProfilePicture } from "../controllers/profileController.ts"
import { protect } from "../middleware/authMiddleware.ts"
import { profilePictureUpload } from "../middleware/uploadMiddleware.ts"

const router: Router = express.Router()

router.post("/upload", protect, profilePictureUpload.single("profilePicture"), uploadProfilePicture)

export default router
