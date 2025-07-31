import express from "express";
import { withAuth } from "./middleware";
import "dotenv/config";

const app = express();
const port = process.env.PORT || 3000;

// Check required environment variables
if (!process.env.UNKEY_ROOT_KEY) {
  console.error("UNKEY_ROOT_KEY environment variable is required");
  process.exit(1);
}

app.get("/public", (req, res) => {
  res.send("Hello World!");
});

app.get(
  "/protected",
  // Make sure your key has a permission called `call-protected-route`
  withAuth({ permission: "call-protected-route" }),
  (_req, res) => {
    res.send("Hello protected world");
  },
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
