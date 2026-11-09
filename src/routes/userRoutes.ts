import express, { type Router } from "express"
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/userController.ts"
import { validate, ValidationSource } from "../helpers/validators.ts"
import { userLoginSchema, userRegisterSchema } from "../models/userSchema.ts"
import upload from "../middleware/uploadMiddleware.ts"

const router: Router = express.Router()

router
  .route("/login")
  .post(upload.none(), validate(userLoginSchema, ValidationSource.BODY), loginUser)
router
  .route("/register")
  .post(upload.none(), validate(userRegisterSchema, ValidationSource.BODY), registerUser)
router.route("/logout").get(logoutUser)
router.route("/refresh").post(refreshAccessToken)
export default router
