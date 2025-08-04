import { NextRequestWithUnkeyContext, withUnkey } from "@unkey/nextjs";
import { NextResponse } from "next/server";

async function handler(req: NextRequestWithUnkeyContext) {
  if (!req?.unkey?.data.valid) {
    return new Response("unauthorized", { status: 403 });
  }

  return new NextResponse(
    `Your API key is valid!
${JSON.stringify(req.unkey, null, 2)}
  `,
  );
}

export const POST = withUnkey(handler, {
  rootKey: process.env.UNKEY_ROOT_KEY!,
  onError: (error) => {
    console.error("Unkey verification failed:", error);
    return new Response("Unauthorized", { status: 401 });
  },
});

export const GET = withUnkey(handler, {
  rootKey: process.env.UNKEY_ROOT_KEY!,
  getKey: (req) => new URL(req.url).searchParams.get("key"),
  onError: (error) => {
    console.error("Unkey verification failed:", error);
    return new Response("Unauthorized", { status: 401 });
  },
});
