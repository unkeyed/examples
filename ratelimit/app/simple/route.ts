import { Unkey } from "@unkey/api";

const unkey = new Unkey({
  rootKey: process.env.UNKEY_ROOT_KEY!,
});

export const GET = async (request: Request): Promise<Response> => {
  const ip = request.headers.get("x-forwarded-for") ?? "anonymous";

  try {
    const res = await unkey.ratelimit.limit({
      namespace: "<you_must_create_namespace_on_app.unkey.com/ratelimits>",
      identifier: ip,
      limit: 10,
      duration: 300000, // 5 minutes in milliseconds
    });

    return Response.json(res.data);
  } catch (error) {
    console.error("Rate limit error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
