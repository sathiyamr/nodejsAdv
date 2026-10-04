import express, { type Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"

import { errorHandler, notFound } from "./middleware/errorMiddleware.ts"
import userRoutes from "./routes/userRoutes.ts"
import todoRoutes from "./routes/todoRoutes.ts"

dotenv.config()

const app: Express = express()

app.use(
  cors({
    origin: process.env.CORS_URL ?? "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (_req, res) => {
  res.json({ message: "API is running" })
})

app.use("/api/users", userRoutes)
app.use("/api/todos", todoRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
