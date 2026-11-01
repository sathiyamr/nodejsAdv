import { Schema, Types, model } from "mongoose"
import type { UserDocument } from "./userModel.ts"

export interface KeyStoreModel {
  client: Types.ObjectId | UserDocument
  primaryKey: string
  secondaryKey: string
  status: boolean
}

export const DOCUMENT_NAME = "KeyStore"
export const COLLECTION_NAME = "keystores"

const keystoreSchema = new Schema<KeyStoreModel>(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    primaryKey: {
      type: String,
      required: true,
    },
    secondaryKey: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, versionKey: false },
)

keystoreSchema.index({ client: 1, primaryKey: 1, secondaryKey: 1 })

const KeyStore = model<KeyStoreModel>(DOCUMENT_NAME, keystoreSchema, COLLECTION_NAME)

export default KeyStore
