import { z } from "zod"

const todoFields = {
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
}

export const createTodoSchema = z.object(todoFields)

export const editTodoSchema = z
  .object({
    ...todoFields,
    status: z.enum(["not-started", "in-progress", "done"], {
      message: "Invalid status",
    }),
  })
  .partial()
  .refine((todo) => Object.keys(todo).length > 0, {
    message: "At least one field must be provided",
  })

export const todoParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid todo id" }),
})
