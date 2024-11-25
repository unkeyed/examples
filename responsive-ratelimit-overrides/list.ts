import { Unkey } from "@unkey/api";

async function main() {
  const unkey = new Unkey({
    rootKey: process.env.UNKEY_ROOT_KEY!,
  });

  const res = await unkey.ratelimits.listOverrides({
    namespaceName: "email.send",
  })

  console.log(JSON.stringify(res, null, 2))
}

main();
