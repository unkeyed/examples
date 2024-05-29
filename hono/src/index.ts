import { Hono } from "hono";
import { unkey, UnkeyContext } from "@unkey/hono";

const app = new Hono<{ Variables: { unkey: UnkeyContext } }>();

app.use("*", unkey());

app.get("/", (c) => {
	return c.text("Hello Hono!");
});

export default app;
