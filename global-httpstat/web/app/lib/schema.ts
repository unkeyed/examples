import { z } from "zod"

const region = z.enum([
  "arn", "bom",
  "cdg", "cle",
  "cpt", "dub",
  "fra", "gru",
  "hkg", "hnd",
  "iad", "icn",
  "kix", "lhr",
  "pdx", "sfo",
  "sin", "syd"
])

export const initRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().url(),
  n: z.number().int().positive().lte(100).optional().default(1),
  regions: z.array(region).nonempty()
})

export const checkResponseSchema = z.array(z.object({
  time: z.number(),
  latency: z.number(),
  status: z.number().int(),
}))

export const initResponseSchema = z.object({
  request: initRequestSchema,
  checkId: z.string(),
  // regionId -> checkResponseSchema
  regions: z.record(checkResponseSchema)
})

export const checkRequestSchema = z.object({
  method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
  url: z.string().url(),
  n: z.number().int().positive().lte(100).optional().default(1),

})
