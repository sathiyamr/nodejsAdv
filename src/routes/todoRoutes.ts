import express, { type Router } from "express"
import { createTodo, getTodos, editTodo, deleteTodo } from "../controllers/todoController.ts"
import { protect } from "../middleware/authMiddleware.ts"
import { validate, ValidationSource } from "../helpers/validators.ts"
import { createTodoSchema, editTodoSchema, todoParamsSchema } from "../models/todoSchema.ts"
import upload from "../middleware/uploadMiddleware.ts"
import apiKeyAuth from "../auth/apiKey.ts"

const router: Router = express.Router()

router.use(apiKeyAuth)

router
  .route("/")
  .post(upload.none(), validate(createTodoSchema, ValidationSource.BODY), protect, createTodo)
  .get(protect, getTodos)
router
  .route("/:id")
  .put(
    upload.none(),
    validate(todoParamsSchema, ValidationSource.PARAMS),
    validate(editTodoSchema, ValidationSource.BODY),
    protect,
    editTodo,
  )
  .delete(validate(todoParamsSchema, ValidationSource.PARAMS), protect, deleteTodo)

export default router
