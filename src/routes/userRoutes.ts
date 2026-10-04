import express, { type Router } from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/userController.ts"

const router: Router = express.Router()

router.route("/login").post(loginUser)
router.route("/register").post(registerUser)
router.route("/logout").get(logoutUser)

export default router
