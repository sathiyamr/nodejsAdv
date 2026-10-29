import { resolve } from "node:path"

export const UPLOADS_DIR = resolve(process.cwd(), "uploads")
export const PROFILE_PICTURES_DIR = resolve(UPLOADS_DIR, "profile")
