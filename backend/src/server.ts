import dotenv from "dotenv";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

// Load environment variables FIRST
dotenv.config();

console.log("AWS Config:", {
  region: process.env.AWS_REGION,
  hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
  hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
  bucketName: process.env.AWS_BUCKET_NAME,
});

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

// AWS TEST
app.get("/test-aws", async (req: Request, res: Response) => {
  try {
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    // list buckets to verify credentials
    const command = new ListBucketsCommand({});
    const response = await s3Client.send(command);

    // check if easel-atelier bucket exists
    const bucketExists = response.Buckets?.some(
      (bucket) => bucket.Name === process.env.AWS_BUCKET_NAME
    );
    res.json({
      success: true,
      message: "AWS creds working!",
      bucketFound: bucketExists,
      bucketName: process.env.AWS_BUCKET_NAME,
    });
  } catch (error) {
    console.error("❌ AWS credentials not working:", error);
    res.status(500).json({
      success: false,
      message: "AWS credentials not working",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
