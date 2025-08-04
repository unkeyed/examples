import { Unkey } from "@unkey/api";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const rootKey = process.env.UNKEY_ROOT_KEY;
  if (!rootKey) {
    return NextResponse.json(
      { error: "UNKEY_ROOT_KEY is undefined" },
      { status: 500 },
    );
  }

  const unkey = new Unkey({ rootKey });
  const url = new URL(req.url);

  const apiId = process.env.UNKEY_API_ID;
  if (!apiId) {
    return NextResponse.json(
      { error: "UNKEY_API_ID is undefined" },
      { status: 500 },
    );
  }

  try {
    const response = await unkey.keys.createKey({
      apiId,
      ratelimits: [
        {
          autoApply: true,
          limit: 5,
          duration: 1000,
          name: "my-test-ratelimit",
        },
      ],
      meta: {
        random: Math.random(),
      },
      credits: {
        remaining: 5,
      },
    });

    if (!response.data) {
      return NextResponse.json(
        { error: "Failed to create key" },
        { status: 500 },
      );
    }

    // At this point you can return the key to your user in your UI.
    // In this example we'll just redirect to another page.
    return NextResponse.redirect(
      new URL(`/keys/verify?key=${response.data.key}`, url),
    );
  } catch (error) {
    console.error("Key creation error:", error);
    return NextResponse.json(
      { error: "Failed to create key" },
      { status: 500 },
    );
  }
}
