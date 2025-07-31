import { Unkey } from "@unkey/api";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const UNKEY_ROOT_KEY = env.UNKEY_ROOT_KEY;

    if (!UNKEY_ROOT_KEY) {
      return new Response("Server configuration error", { status: 500 });
    }

    const unkey = new Unkey({ rootKey: UNKEY_ROOT_KEY });

    // Grab the key from the authorization header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized (No key)", { status: 401 });
    }

    const key = authHeader.replace("Bearer ", "");

    try {
      const response = await unkey.keys.verifyKey({ key });

      if (!response.data.valid) {
        return new Response("Unauthorized", { status: 401 });
      }

      // proceed to handle the request
      // since this is a demo, we just return the result
      return Response.json(response.data);
    } catch (error) {
      console.error("Key verification error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};

// Type definition for the environment
interface Env {
  UNKEY_ROOT_KEY: string;
}
