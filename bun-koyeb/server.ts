import { Unkey } from "@unkey/api";

const port = process.env.PORT || 8000;
const UNKEY_ROOT_KEY = process.env.UNKEY_ROOT_KEY || "";

if (!UNKEY_ROOT_KEY) {
  console.error("UNKEY_ROOT_KEY environment variable is required");
  process.exit(1);
}

const unkey = new Unkey({ rootKey: UNKEY_ROOT_KEY });

console.log(
  `Launching Bun HTTP server on port: ${port}, url: http://0.0.0.0:${port} 🚀`,
);

Bun.serve({
  async fetch(req) {
    const key = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!key) {
      return new Response("Unauthorized", { status: 401 });
    }

    try {
      const response = await unkey.keys.verifyKey({ key });

      if (!response.data.valid) {
        return new Response("Unauthorized", { status: 401 });
      }

      return Response.json(response);
    } catch (error) {
      console.error("Key verification error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
  port,
});
