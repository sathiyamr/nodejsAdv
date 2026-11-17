import { Schema, Types, model } from "mongoose"

export interface RoleDoc {
  _id: Types.ObjectId
  code: ROLES
  status: boolean
}

export enum ROLES {
  USER = "User",
  ADMIN = "Admin",
}

export const DOCUMENT_NAME = "Role"
export const COLLECTION_NAME = "roles"

const roleSchema = new Schema<RoleDoc>(
  {
    code: {
      type: String,
      required: true,
      enum: Object.values(ROLES),
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
)

roleSchema.index({ code: 1, status: 1 })

const RoleModel = model<RoleDoc>(DOCUMENT_NAME, roleSchema, COLLECTION_NAME)
export default RoleModel
