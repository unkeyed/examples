import { Unkey } from "@unkey/api";

const port = Number(Deno.env.get("PORT")) || 8000;
const UNKEY_ROOT_KEY = Deno.env.get("UNKEY_ROOT_KEY") || "";

if (!UNKEY_ROOT_KEY) {
  console.error("UNKEY_ROOT_KEY environment variable is required");
  Deno.exit(1);
}

const unkey = new Unkey({ rootKey: UNKEY_ROOT_KEY });

console.log(
  `Launching Deno HTTP server on port: ${port}, url: http://0.0.0.0:${port} 🚀`,
);

const handler = async (req: Request): Promise<Response> => {
  const key = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!key) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const response = await unkey.keys.verifyKey({ key });

    if (!response.data.valid) {
      return new Response("Unauthorized", { status: 401 });
    }

    return Response.json(response.data);
  } catch (error) {
    console.error("Key verification error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

Deno.serve({ port }, handler);
