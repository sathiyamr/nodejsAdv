import express, { type Router } from "express"
import { createTodo, getTodos, editTodo, deleteTodo } from "../controllers/todoController.ts"
import { protect } from "../middleware/authMiddleware.ts"

const router: Router = express.Router()

router.route("/").post(protect, createTodo).get(protect, getTodos)
router.route("/:id").put(protect, editTodo).delete(protect, deleteTodo)

export default router
