import mongoose from "mongoose"
import { db } from "../config.ts"
import Logger from "../core/Logger.ts"

const dbURI = `mongodb://${db.user}:${db.password}@${db.host}:${db.port}/${db.name}`

const options = {
  autoIndex: true,
  minPoolSize: db.minPoolSize,
  maxPoolSize: db.maxPoolSize,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
}

// Enable Mongoose strict query behavior
mongoose.set("strictQuery", true)

// Enable validators for update operations
function setRunValidators() {
  return { runValidators: true }
}

// Configure Mongoose update validators
mongoose.plugin((schema: any) => {
  schema.pre("findOneAndUpdate", setRunValidators)
  schema.pre("updateMany", setRunValidators)
  schema.pre("updateOne", setRunValidators)
  schema.pre("update", setRunValidators)
})

// MongoDB connection events
mongoose.connection.on("connected", () => {
  Logger.info("Mongoose connected to MongoDB")
})

mongoose.connection.on("error", (error) => {
  Logger.error("Mongoose connection error:", error)
})

mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose disconnected from MongoDB")
})

export async function connectDB() {
  try {
    await mongoose.connect(dbURI, options)
    console.log("MongoDB connection established")
    Logger.info("MongoDB connection established")
    return mongoose.connection
  } catch (error) {
    Logger.error("MongoDB connection error:", error)
    throw error
  }
}

async function shutdown(signal: any) {
  Logger.info(`Received ${signal}`)

  try {
    await mongoose.connection.close()
    Logger.info("MongoDB connection closed")
    process.exit(0)
  } catch (error) {
    Logger.error("Error during shutdown", error)
    process.exit(1)
  }
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)

// Export Mongoose connection
export const connection = mongoose.connection
