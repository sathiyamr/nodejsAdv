import mongoose, { Schema, Types } from "mongoose"
import { DOCUMENT_NAME as USER_DOCUMENT_NAME } from "./userModel.ts"

export interface TodoDoc {
  user: Types.ObjectId
  title: string
  description: string
  status: Status
}

export enum Status {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export const DOCUMENT_NAME = "Todo"
export const COLLECTION_NAME = "todos"

const todoModel = new Schema<TodoDoc>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: USER_DOCUMENT_NAME,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: Status.NOT_STARTED,
      enum: Object.values(Status),
    },
  },
  {
    timestamps: true,
  },
)

const Todo = mongoose.model(DOCUMENT_NAME, todoModel, COLLECTION_NAME)

export default Todo
