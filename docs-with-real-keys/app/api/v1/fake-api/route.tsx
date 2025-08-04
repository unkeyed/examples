import { withUnkey } from "@unkey/nextjs";

export const POST = withUnkey(
  async (req) => {
    // At this point the request has been verified and the key is valid
    // You have access to the verification response using `req.unkey`
    console.log("Verified key data:", req.unkey);

    return Response.json({
      message: "Request authenticated successfully",
      verifiedKeyData: req.unkey,
      timestamp: new Date().toISOString(),
    });
  },
  {
    rootKey: process.env.UNKEY_ROOT_KEY!,
    onError: (nextReq) => {
      console.error("Unkey verification failed:", nextReq.body);
      return Response.json({ message: "We are cooked" });
    },
  },
);
