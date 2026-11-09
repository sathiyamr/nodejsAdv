import express, { type Router } from "express"
import { deleteAllKeyStore } from "../controllers/KeyStoreController.ts"

const router: Router = express.Router()

router.delete("/deleteAll", deleteAllKeyStore)

export default router
