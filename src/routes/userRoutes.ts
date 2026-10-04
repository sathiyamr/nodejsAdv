import express, { type Router } from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/userController.ts"
import { validate, ValidationSource } from "../helpers/validators.ts"
import { userLoginSchema, userRegisterSchema } from "../models/userSchema.ts"

const router: Router = express.Router()

router.route("/login").post(validate(userLoginSchema, ValidationSource.BODY), loginUser)
router.route("/register").post(validate(userRegisterSchema, ValidationSource.BODY), registerUser)
router.route("/logout").get(logoutUser)

export default router
