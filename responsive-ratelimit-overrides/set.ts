import { Unkey } from "@unkey/api";

async function main() {
  const unkey = new Unkey({
    rootKey: process.env.UNKEY_ROOT_KEY!,
  });

  // Triggered by a user action, or stripe webhook or similar
  const res = await unkey.ratelimits.setOverride({
    namespaceName: "email.send",
    // set the override for all users with this domain
    identifier: "*@customer.com",
    limit: 1000,
    duration: 60_000, // 1 minute
  })
  console.log(res)
}

main();
