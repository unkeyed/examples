/**
 * By adding one or more resources in the request, we can collect all of these events and provide an
 * audit log for you.
 * 
 * See https://unkey.dev/docs/features/audit-log for more information
 */
import {Ratelimit} from "@unkey/ratelimit"

const unkey = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY!,
  namespace: "nextjs-route-demo",
  async: true,
  limit: 10,
  duration: "5m"
})

export const GET = async(request:Request):Promise<Response> =>{

  const ip = request.headers.get("x-forwarded-for") ?? "anonymous"

  const res = await unkey.limit(ip, {
    resources: [
      {
        type: "framework",
        id: "nextjs",
        name: "Next.js",
        meta: {
          "app-router": true
        }
      },
      {
        type: "resource2",
        id: crypto.randomUUID()
      }
    ]
  })

  return Response.json(res)
}