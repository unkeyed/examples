import { Unkey } from "@unkey/api";

export async function POST(req: Request) {
  const rootKey = process.env.UNKEY_ROOT_KEY;
  if (!rootKey) {
    return Response.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const unkey = new Unkey({ rootKey });

  try {
    const { license } = (await req.json()) as { license: string };

    const response = await unkey.keys.verifyKey({ key: license });

    return Response.json(
      {
        valid: response.data.valid,
        expires: response.data.expires,
      },
      {
        status: response.data.valid ? 200 : 403,
      },
    );
  } catch (error) {
    console.error("Key verification error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
