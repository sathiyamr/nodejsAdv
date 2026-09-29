import express, { type Express } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import logger from "./core/Logger.js"

import { errorHandler, notFound } from "./middleware/errorMiddleware.js"
import userRoutes from "./routes/userRoutes.js"
import todoRoutes from "./routes/todoRoutes.js"
import { connectDB } from "./database/index.js"

dotenv.config()

const app: Express = express()
const port = Number(process.env.PORT ?? 5000)

app.use(
  cors({
    origin: process.env.CORS_URL ?? "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "API is running" })
})

app.use("/api/users", userRoutes)
app.use("/api/todos", todoRoutes)

app.use(notFound)
app.use(errorHandler)

async function startServer() {
  try {
    await connectDB()
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
      logger.info("Server started")
    })
  } catch (error) {
    logger.error("Failed to start server because MongoDB connection failed", error)
    process.exit(1)
  }
}

startServer()

export default app
