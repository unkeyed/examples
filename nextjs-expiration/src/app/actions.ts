"use server";
import { Unkey } from "@unkey/api";
import { revalidatePath } from "next/cache";
import { keys } from "@/server/keys";

export async function createKey(_formDate: FormData) {
  const rootKey = process.env.UNKEY_ROOT_KEY;
  if (!rootKey) {
    throw new Error("UNKEY_ROOT_KEY is not defined");
  }

  const unkey = new Unkey({ rootKey });

  const apiId = process.env.UNKEY_API_ID;
  if (!apiId) {
    throw new Error("UNKEY_API_ID is not defined");
  }

  const expires = Date.now() + 1000 * 60; // 1 minute

  try {
    const res = await unkey.keys.createKey({
      apiId,
      prefix: "forecast",
      expires,
    });

    if (!res.data) {
      throw new Error("Failed to create key");
    }

    keys.push({
      key: res.data.key,
      keyId: res.data.keyId,
      expires,
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Key creation error:", error);
    throw new Error("Failed to create key");
  }
}
