import { Unkey } from "@unkey/api";
import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;
const UNKEY_ROOT_KEY = process.env.UNKEY_ROOT_KEY || "";

if (!UNKEY_ROOT_KEY) {
  console.error("UNKEY_ROOT_KEY environment variable is required");
  process.exit(1);
}

const unkey = new Unkey({ rootKey: UNKEY_ROOT_KEY });

app.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

// This endpoint is protected by Unkey
app.get("/secret", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const key = authHeader?.toString().replace("Bearer ", "");

  if (!key) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const response = await unkey.keys.verifyKey({ key });

    if (!response.data.valid) {
      return res.status(401).send("Unauthorized");
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Key verification error:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
