"use server";
import { EmailTemplate } from "@/components/email/otp-email";
import { Resend } from "resend";
import { Ratelimit } from "@unkey/ratelimit";
import { headers } from "next/headers";
import { randomInt } from "crypto";
const resend = new Resend(process.env.RESEND_API_KEY);

/**
   Configure the ratelimit to be 1 request every 60 seconds.
   We also care about being accurate over faster response
   so we will make sure it's a synchonorous rate limit.
**/

const unkey = new Ratelimit({
  rootKey: process.env.UNKEY_ROOT_KEY!,
  namespace: "otp-limit",
  limit: 1,
  duration: "60s",
});

export async function sendOTP(formData: FormData) {
  try {
    // check for forwarded
    const forwarded_ip = headers().get("x-forwarded-for");
    // check for real-ip
    const real_ip = headers().get("x-real-ip");

    const email = formData.get("email") as string | null;
    if (!email) {
      return {
        success: false,
        error: "Email was not supplied, please try again",
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
        error: `You can request a new code in ${timeToReset} seconds`,
        statusCode: 429,
      };
    }
    const otp = randomInt(100000, 999999).toString();

    const { data, error } = await resend.emails.send({
      from: "james@updates.unkey.com",
      to: email,
      subject: "OTP code",
      text: `Your OTP code is ${otp}`,
      react: EmailTemplate({ otp: otp }) as React.ReactElement,
    });
    // handled error
    if (error) {
      console.error(error);
      return { success: false, error: "Failed to send email", statusCode: 500 };
    }
    return {
      success: true,
      statusCode: 201,
    };
    //catch that puppy
  } catch (e) {
    return { success: false, error: "Failed to send email", statusCode: 500 };
  }
}
