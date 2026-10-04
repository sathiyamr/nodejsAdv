import dotenv from "dotenv"
import app from "./app.ts"
import logger from "./core/Logger.ts"
import { connectDB } from "./database/index.ts"

dotenv.config()

const port = Number(process.env.PORT ?? 5000)

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
