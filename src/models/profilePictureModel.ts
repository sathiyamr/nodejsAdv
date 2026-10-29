import mongoose, { Schema, Types } from "mongoose"

export interface ProfilePictureDocument {
  user: Types.ObjectId
  filename: string
  mimeType: "image/jpeg" | "image/png" | "image/webp"
  size: number
}

const profilePictureSchema = new Schema<ProfilePictureDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    filename: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
      enum: ["image/jpeg", "image/png", "image/webp"],
    },
    size: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "profile_picture",
  },
)

const ProfilePicture = mongoose.model("ProfilePicture", profilePictureSchema)

export default ProfilePicture
