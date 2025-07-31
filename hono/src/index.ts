import { Hono } from "hono";
import { unkey, type UnkeyContext } from "@unkey/hono";

const app = new Hono<{ Variables: { unkey: UnkeyContext } }>();

app.use(
  "*",
  unkey({
    rootKey: "unkey_3ZGW4LqobX2MLpVBs9uxHxsB",
  }),
);

app.get("/", (c) => {
  const unkey = c.get("unkey");
  if (!unkey.data.valid) {
    return c.text("Go away");
  }
  return c.text("Hello Hono!");
});

export default app;
