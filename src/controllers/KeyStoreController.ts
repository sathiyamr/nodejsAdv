import type { RequestHandler } from "express"
import KeyStore, { type KeyStoreDoc } from "../models/KeyStoreModel.ts"
import type { UserDoc } from "../models/userModel.ts"
import asyncHandler from "express-async-handler"

export const createKeyStore = async (
  client: UserDoc,
  primaryKey: string,
  secondaryKey: string,
): Promise<KeyStoreDoc> => {
  const key = await KeyStore.create({
    client,
    primaryKey,
    secondaryKey,
  })

  return key
}

export const deleteAllKeyStore: RequestHandler = asyncHandler(async (req, res) => {
  await KeyStore.deleteMany({}) // deletes every keystore in the entire database for ALL users:
  res.status(200).json({ message: "deleted all the keystore" })
})
