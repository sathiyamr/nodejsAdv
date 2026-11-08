import { z } from "zod"
import { ApiKeyHeader } from "./utils.ts"

export const zodAuthBearer = z
  .string()
  .refine((value) => value.startsWith("Bearer "), {
    message: "Bearer Token Doesnt exist",
  })
  .refine((value) => value.split(" ")[1], { message: "Authorization token doesnt exist" })

// export const apiKeySchema = z.object({
//   [ApiKeyHeader.API_KEY]: z.string().nonempty(`${ApiKeyHeader.API_KEY} is required`),
//   authorization: zodAuthBearer,
// })

// export type ApiKeySchema = z.infer<typeof apiKeySchema>

export default {
  apiKey: z.object({
    [ApiKeyHeader.API_KEY]: z.string().nonempty(`${ApiKeyHeader.API_KEY} is required`),
  }),
  auth: z.object({
    authorization: zodAuthBearer,
  }),
}
