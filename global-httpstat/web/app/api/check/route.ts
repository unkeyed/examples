


import { z } from "zod";
import { verifyKey } from "@unkey/api"
import { initRequestSchema, initResponseSchema, checkRequestSchema, checkResponseSchema } from "@/app/lib/schema";
import { customAlphabet } from "nanoid"

import { Redis } from "@upstash/redis"
const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");


export async function POST(request: Request) {


  const redis = Redis.fromEnv()



  const req = initRequestSchema.safeParse(await request.json())
  if (!req.success) {
    return new Response(req.error.message, { status: 400 })
  }
  const key = request.headers.get("authorization")?.replace("Bearer ", "")
  if (!key) {
    return new Response("authorization header missing", { status: 401 })
  }

  const auth = await verifyKey(key)
  if (auth.error) {
    return new Response(auth.error.message, { status: 500 })
  }
  if (!auth.result.valid) {
    return new Response("invalid key", { status: 401 })
  }



  const responses = await Promise.all(req.data.regions.map(async region => {
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    const url = `${baseUrl}/api/check/${region}`
    console.log("fetching", url)
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.INTERNAL_AUTH_TOKEN!,
      },
      body: JSON.stringify({
        method: req.data.method,
        url: req.data.url,
        n: req.data.n,
      } satisfies z.infer<typeof checkRequestSchema>)
    })
    if (!res.ok) {
      console.error("error", res.status, await res.text())
      return { region, runs: [] }
    }

    const runs = checkResponseSchema.parse(await res.json())
    return { region, runs }
  }))

  const res = {
    checkId: nanoid(12),
    regions: responses.reduce((acc, cur) => {
      acc[cur.region] = cur.runs
      return acc
    }, {} as z.infer<typeof initResponseSchema>["regions"]),
    request: req.data,

  } satisfies z.infer<typeof initResponseSchema>

  const p = redis.pipeline()
  p.set(`check:${res.checkId}`, res, { ex: 60 * 60 * 24 * 30 })
  p.zadd(`user:${auth.result.ownerId}:checks`, {
    score: Date.now(),
    member: res.checkId
  })
  await p.exec()

  return new Response(JSON.stringify(
    res
  ), {
    headers: {
      "Content-Type": "application/json"
    }
  })






}
