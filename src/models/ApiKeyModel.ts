import { model, Schema, Types } from "mongoose"

export enum Permission {
  GENERAL = "GENERAL",
  CREATE = "CREATE",
}

export interface ApiKeyDoc {
  key: string
  version: number
  permission: string[]
  status: boolean
}

export const DOCUMENT_NAME = "ApiKey"
export const COLLECTION_NAME = "apikeys"

const apiKeySchema = new Schema<ApiKeyDoc>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      maxLength: 1024,
      trim: true,
    },
    version: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },
    permission: {
      type: [
        {
          type: String,
          required: true,
          enum: Object.values(Permission),
        },
      ],
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

apiKeySchema.index({ key: 1, status: 1 })

const ApiKeyModel = model<ApiKeyDoc>("ApiKey", apiKeySchema)
export default ApiKeyModel
