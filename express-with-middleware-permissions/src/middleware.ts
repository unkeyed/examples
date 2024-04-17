import { RequestHandler, type Request} from "express";
import { Unkey, and } from "@unkey/api";

export function withAuth(opts: { permission: string }): RequestHandler {
  
  const unkey = new Unkey({
    rootKey: process.env.UNKEY_ROOT_KEY!,
  });
  return async (req, res, next) => {
    const key = req.headers["authorization"]?.split(" ").at(1);
    if (!key) {
      console.log("no api key found");
      res.status(401);
      return res.send("unauthorized");
    }

    const { result, error } = await unkey.keys.verify({
      apiId: process.env.UNKEY_API_ID!,
      key,
      authorization: { permissions: opts.permission },
    });
    if (error) {
      throw new Error(error.message);
    }

    if (!result.valid) {
      console.log("forbidden", result.code);
      res.status(403);
      return res.send("forbidden");
    }

    return next();
  };
}
