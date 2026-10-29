import crypto from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"
import dotenv from "dotenv"
import mongoose from "mongoose"
import Logger from "../core/Logger.ts"
import ApiKeyModel, { Permission, type ApiKeyDoc } from "../models/ApiKeyModel.ts"
import { connectDB } from "./index.ts"

dotenv.config()

export interface SeedApiKeyOptions {
  key?: string
  version?: number
  permission?: Permission[] | string[]
  status?: boolean
}

/**
 * Generates a random cryptographic hex string for use as an API key.
 * @param bytes Number of random bytes (default: 32 bytes = 64 hex characters)
 */
export function generateApiKey(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("hex")
}

/**
 * Seeds a sample API Key into the MongoDB database based on ApiKeyModel schema.
 * If the key already exists, returns the existing document without creating duplicates.
 *
 * @param options Custom options for key, version, permissions, and status
 * @returns The seeded or existing ApiKey document
 */
export async function seedApiKey(options: SeedApiKeyOptions = {}): Promise<ApiKeyDoc> {
  const targetKey = options.key ?? generateApiKey()

  const version = options.version ?? 1
  const permission = options.permission ?? [Permission.GENERAL]
  const status = options.status ?? true

  // Check if API key already exists to ensure idempotency
  const existingApiKey = await ApiKeyModel.findOne({ key: targetKey })
  if (existingApiKey) {
    Logger.info(`[Seed] API key already exists: ${existingApiKey.key}`)
    return existingApiKey
  }

  // Create new API key
  const newApiKey = await ApiKeyModel.create({
    key: targetKey,
    version,
    permission,
    status,
  })

  Logger.info(`[Seed] Sample API key created successfully: ${newApiKey.key}`)
  return newApiKey
}

// Automatically run seed when executed directly via CLI
const currentFilePath = fileURLToPath(import.meta.url)
const isDirectExecution =
  process.argv[1] && path.resolve(process.argv[1]) === path.resolve(currentFilePath)

if (isDirectExecution) {
  ;(async () => {
    try {
      await connectDB()
      const seededKey = await seedApiKey()
      console.log("\n========================================")
      console.log("   API Key Seeded Successfully")
      console.log("========================================")
      console.log(`Key:        ${seededKey.key}`)
      console.log(`Version:    ${seededKey.version}`)
      console.log(`Permission: ${seededKey.permission.join(", ")}`)
      console.log(`Status:     ${seededKey.status ? "Active" : "Inactive"}`)
      console.log("----------------------------------------")
      console.log(`Request Header:  x-api-key: ${seededKey.key}`)
      console.log("========================================\n")
      await mongoose.disconnect()
      process.exit(0)
    } catch (error) {
      Logger.error("[Seed] Error seeding API key:", error)
      console.error("[Seed Error]", error)
      await mongoose.disconnect()
      process.exit(1)
    }
  })()
}

export default seedApiKey
