"use server";
import { auth } from "@clerk/nextjs";
import { Unkey } from "@unkey/api";
export async function create(formData: FormData) {
  "use server";
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const token = process.env.UNKEY_ROOT_KEY;
  const apiId = process.env.UNKEY_API_ID;

  if (!token || !apiId) {
    return null;
  }

  const name = formData.get("name") as string;
  // Ensure name is never empty - use default if empty or null
  const keyName = name && name.trim().length > 0 ? name.trim() : "My Awesome API";
  
  const unkey = new Unkey({ rootKey: token });
  const res = await unkey.keys.createKey({
    name: keyName,
    apiId,
  });
  return { data: res.data, meta: res.meta };
}
