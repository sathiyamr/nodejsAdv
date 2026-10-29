import { z } from "zod"
import { ApiKeyHeader } from "./utils.ts"

export const apiKeySchema = z.object({
  [ApiKeyHeader.API_KEY]: z.string().nonempty(`${ApiKeyHeader.API_KEY} is required`),
})

export type ApiKeySchema = z.infer<typeof apiKeySchema>
