import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import express, { Request, Response } from "express";
import { clerkMiddleware, clerkClient, requireAuth } from "@clerk/express";

const app = express();
const port = 8000;

// Convert NEXT_PUBLIC key
const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;

// Set the converted key
process.env.CLERK_PUBLISHABLE_KEY = publishableKey;

// vertify required environment variable are present
if (!publishableKey || !secretKey) {
  console.error("❌ Missing Clerk keys:", {
    hasPublishableKey: !!publishableKey,
    hasSecretKey: !!secretKey,
  });
  process.exit(1);
}
console.log("✅ Clerk keys loaded successfully");

app.use(clerkMiddleware());

// on public routes no auth is required
app.get("/", (req, res) => {
  res.send("Hello World");
});

// protected routes require auth
app.get("/protected", requireAuth(), async (req: Request, res: Response) => {
  // double assertion to safetly access auth by clerk
  const { auth } = req as unknown as { auth: { userId: string } };
  // fetch user details
  const user = await clerkClient.users.getUser(auth.userId);
  res.json({ user });
});

// test auth route
app.get("/test-auth", requireAuth(), (req: Request, res: Response) => {
  const { auth } = req as unknown as { auth: { userId: string } };
  res.json({
    message: "Auth is working!",
    userId: auth.userId,
  });
});

// start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
