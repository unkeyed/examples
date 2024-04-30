import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  /**
   * 1. Load the license key from .env and ensure it was provided
   * 
   * redirect the user to an error page if not
   */
  const license = process.env.LICENSE_KEY;
  if (!license) {
    url.pathname = "/license-required";
    url.searchParams.set(
      "error",
      "No license key found in env: set LICENSE_KEY"
    );
    return NextResponse.rewrite(url);
  }

  /**
   * 2. Check the cookie cache to speed up verification
   */
  const cached = request.cookies.get("license");
  if (cached && cached.value === "valid") {
    return NextResponse.next();
  }

  /**
   * 3. If there is no cookie, we go to the upstream verification API
   */
  const result = await fetch("https://license.unkey.app/api/verify", {
    method: "POST",
    body: JSON.stringify({
      license,
    }),
  });

  const { valid, expires } = (await result.json()) as {
    valid: boolean;
    expires?: number;
  };

  /**
   * 4. If the license key is invalid, we rewrite the response to an error page
   */
  if (!valid) {
    url.pathname = "/license-required";
    url.searchParams.set("error", "License invalid");
    return NextResponse.rewrite(url);
  }

  /**
   * 5. Set the cache cookie
   * cookie expiry is at most 1 hour
   */
  const res = NextResponse.next();
  res.cookies.set("license", "valid", {
    expires: Math.min(
      expires ?? Number.POSITIVE_INFINITY,
      Date.now() + 60 * 60 * 1000
    ),
  });
  return res;
}

export const config = {
  matcher: ["/ee/:path*"],
};
