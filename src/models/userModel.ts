import mongoose, { Schema, Types } from "mongoose"
import bcrypt from "bcryptjs"
import { DOCUMENT_NAME as ROLE_DOCUMENT_NAME, type RoleDoc } from "./RoleModel.ts"

export interface UserDoc {
  _id: Types.ObjectId
  name: string
  email: string
  password: string
  isAdmin?: boolean
  roles: Types.ObjectId[]
  matchPassword(enteredPassword: string): Promise<boolean>
}

export const DOCUMENT_NAME = "User"
export const COLLECTION_NAME = "users"

const userSchema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    roles: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: ROLE_DOCUMENT_NAME,
      },
    ],
  },
  {
    timestamps: true,
  },
)

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model(DOCUMENT_NAME, userSchema, COLLECTION_NAME)

export default User
