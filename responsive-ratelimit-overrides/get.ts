import { Unkey } from "@unkey/api";

async function main() {
  const unkey = new Unkey({
    rootKey: process.env.UNKEY_ROOT_KEY!,
  });

  const res = await unkey.ratelimits.getOverride({
    namespaceName: "email.send",
    // set the override for all users with this domain
    identifier: "*@customer.com",
  })
  console.log(res)
}

main();
