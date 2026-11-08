import KeyStore, { type KeyStoreModel } from "../models/KeyStoreModel.ts"
import type { UserDocument } from "../models/userModel.ts"

export const createKeyStore = async (
  client: UserDocument,
  primaryKey: string,
  secondaryKey: string,
): Promise<KeyStoreModel> => {
  const key = await KeyStore.create({
    client,
    primaryKey,
    secondaryKey,
  })

  return key
}
