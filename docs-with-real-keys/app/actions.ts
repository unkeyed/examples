"use server";
import { Unkey } from "@unkey/api";
import { cookies } from "next/headers";

export async function signIn(): Promise<void> {
  const userId = `user_${crypto.randomUUID().replaceAll("-", "")}`;

  const rootKey = process.env.UNKEY_ROOT_KEY;
  if (!rootKey) {
    throw new Error("UNKEY_ROOT_KEY is not defined");
  }

  const apiId = process.env.UNKEY_API_ID;
  if (!apiId) {
    throw new Error("UNKEY_API_ID is not defined");
  }

  const unkey = new Unkey({ rootKey });

  try {
    const response = await unkey.keys.createKey({
      apiId,
      prefix: "docs",
    });

    if (!response.data) {
      throw new Error("Failed to create key");
    }

    // Store the key ID or other relevant data if needed
    console.log("Created key:", response.data.keyId);

    cookies().set("fakeUserId", response.data.keyId, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  } catch (error) {
    console.error("Sign in error:", error);
    throw new Error("Failed to sign in user");
  }
}
