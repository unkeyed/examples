"use server"

import { Unkey } from "@unkey/api"
import { cookies } from "next/headers"



export async function signIn(): Promise<void> {


  const userId = `user_${crypto.randomUUID().replaceAll("-", "")}`



  const unkey = new Unkey({
    rootKey: process.env.UNKEY_ROOT_KEY!
  })
  await unkey.keys.create({
    apiId: process.env.UNKEY_API_ID!,
    prefix: "docs",
    ownerId: userId
  })


  cookies().set("fakeUserId", userId, {
    maxAge: 60 * 60 * 24 * 7
  })
}
