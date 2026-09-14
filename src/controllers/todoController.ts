import asyncHandler from "express-async-handler"
import type { RequestHandler } from "express"
import Todo from "../models/todoModel.js"
import type { AuthRequest } from "../types/request.js"

const createTodo: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const { title, description } = req.body
  console.log(req.user)

  if (!title || !description) {
    res.status(400)
    throw new Error("Title and Description are required")
  }

  await Todo.create({ user: req.user!._id, title, description })

  res.status(201).json({ title, description })
})

const getTodos: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  // `!` tells TypeScript that authentication middleware has already set `req.user`.
  const user = req.user!
  const todos = await Todo.find({
    user: user,
  })
  res.json(todos)
})

const editTodo: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const { title, description, status } = req.body

  const user = req.user!

  if (!title || !description || !status) {
    res.status(400)
    throw new Error("Title, Description, and Status are required")
  }

  const todo = await Todo.findById(req.params.id)

  if (!todo) {
    res.status(404)
    throw new Error("Todo not found")
  }

  if (todo.user.toString() !== user._id.toString()) {
    res.status(401)
    throw new Error("Not authorized to update this todo")
  }

  todo.title = title
  todo.description = description
  todo.status = status

  const updatedTodo = await todo.save()

  res.json(updatedTodo)
})

const deleteTodo: RequestHandler = asyncHandler(async (req: AuthRequest, res) => {
  const todo = await Todo.findById(req.params.id)

  if (todo) {
    await todo.deleteOne()
    res.json({ message: "Todo removed" })
  } else {
    res.status(404)
    throw new Error("Todo not found")
  }
})

export { createTodo, getTodos, editTodo, deleteTodo }
