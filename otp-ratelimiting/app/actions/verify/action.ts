"use server";
import { Ratelimit } from "@unkey/ratelimit";
import { headers } from "next/headers";

/**
   Configure the ratelimit to be 1 request every 60 seconds.
   We also care about being accurate over faster response
   so we will make sure it's a synchonorous rate limit.
**/

const unkey = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY!,
  namespace: "otp-verify",
  limit: 2,
  duration: "30s",
});

export async function verifyOTP(prevState: any, formData: FormData) {
  try {
    // check for forwarded
    let forwarded_ip = headers().get("x-forwarded-for");
    // check for real-ip
    let real_ip = headers().get("x-real-ip");
    if (forwarded_ip) {
      forwarded_ip.split(/, /)[0];
    }
    if (real_ip) {
      real_ip = real_ip.trim();
    }

    const code = formData.get("code") as string | null;

    if (!code) {
      return {
        success: false,
        error: "Code was not supplied, please try again",
        statusCode: 400,
      };
    }

    const { success, reset } = await unkey.limit(
      forwarded_ip || real_ip || "no-ip",
    );
    const millis = reset - Date.now();
    const timeToReset = Math.floor(millis / 1000);

    if (!success) {
      return {
        success: false,
        error: `You have been rate limited, please wait ${timeToReset} seconds and try entering a new code`,
        statusCode: 429,
      };
    }
    const random_boolean = Math.random() < 0.5;
    if (!random_boolean) {
      return {
        success: false,
        statusCode: 400,
        error: "Sorry this code was incorrect, for the demo this is random",
      };
    }
    return {
      success: true,
      statusCode: 200,
    };
    //catch that puppy
  } catch (e) {
    return { success: false, error: "Failed to verify code", statusCode: 500 };
  }
}
