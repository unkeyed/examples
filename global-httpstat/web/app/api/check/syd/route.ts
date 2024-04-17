

import { z } from "zod"
import { checkRequestSchema, checkResponseSchema } from "@/app/lib/schema";

export const runtime = "edge"
export const preferredRegion = ["arn1"]
export const fetchCache = "force-no-store"



export async function POST(request: Request) {
  const auth = request.headers.get("authorization")
  if (!auth) {
    return new Response("authorization header missing", { status: 401 })
  }
  if (auth !== process.env.INTERNAL_AUTH_TOKEN) {
    return new Response("authorization header invalid", { status: 401 })
  }

  const req = checkRequestSchema.safeParse(await request.json())
  if (!req.success) {
    return new Response(req.error.message, { status: 400 })
  }

  const results: z.infer<typeof checkResponseSchema> = []
  for (let i = 0; i < req.data.n; i++) {
    const time = Date.now()
    const res = await fetch(req.data.url, {
      method: req.data.method,
    })
    const latency = Date.now() - time
    results.push({
      status: res.status,
      latency,
      time
    })
  }


  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json"
    }
  })






}
