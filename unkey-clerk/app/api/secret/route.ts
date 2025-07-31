import { Unkey } from "@unkey/api";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const header = request.headers.get("Authorization");
  if (!header) {
    return new Response("No Authorization header", { status: 401 });
  }
  const token = header.replace("Bearer ", "");
  
  const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY! });
  
  try {
    const response = await unkey.keys.verifyKey({
      key: token,
    });

    // In v2, the response structure is different
    if (!response.data.valid) {
      // do not grant access
      return new Response("Unauthorized", { status: 401 });
    }

    // process request
    return NextResponse.json({ result: response });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
