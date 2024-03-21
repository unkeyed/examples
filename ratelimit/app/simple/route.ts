
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

  const res = await unkey.limit(ip)

  return Response.json(res)
}