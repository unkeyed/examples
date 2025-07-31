import { RequestHandler } from "express";
import { Unkey } from "@unkey/api";

export function withAuth(opts: { permission: string }): RequestHandler {
  const unkey = new Unkey({
    rootKey: process.env.UNKEY_ROOT_KEY!,
  });

  return async (req, res, next) => {
    const key = req.headers["authorization"]?.split(" ").at(1);

    if (!key) {
      console.log("no api key found");
      return res.status(401).send("unauthorized");
    }

    try {
      const response = await unkey.keys.verifyKey({
        key,
        permissions: opts.permission,
      });

      if (!response.data.valid) {
        console.log("forbidden", response.data.code);
        return res.status(403).send("forbidden");
      }

      return next();
    } catch (error) {
      console.error("Key verification error:", error);
      return res.status(500).send("Internal Server Error");
    }
  };
}
