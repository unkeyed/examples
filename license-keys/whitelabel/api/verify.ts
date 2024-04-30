import { verifyKey } from "@unkey/api";

export async function POST(req: Request) {
  const { license } = (await req.json()) as { license: string };

  const unkey = await verifyKey({
    key: license,
    apiId: process.env.UNKEY_API_ID!,
  });

  if (unkey.error) {
    console.error(unkey.error);
    return Response.json({ error: unkey.error.message }, { status: 500 });
  }

  return Response.json(
    {
      valid: unkey.result.valid,
      expires: unkey.result.expires,
    },
    {
      status: unkey.result.valid ? 200 : 403,
    }
  );
}
