import { withUnkey } from "@unkey/nextjs";

export const POST = withUnkey(async (req) => {
  // At this point the request has been verified and the key is valid
  //
  // Now you can process the request
  // You have access to the verification response using `req.unkey`
  console.log(req.unkey);

  return new Response(`Hello ${req.unkey?.ownerId}`);
});
