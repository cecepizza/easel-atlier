// api/index.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import express, { Request, Response } from "express";
import routes from "../src/routes/index"; // Your existing routes
import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Use your existing routes
app.use(routes);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // For simple health check, don't initialize the full app
  if (req.url === "/") {
    return res.status(200).json({
      message: "API is working",
      env: {
        stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
        awsKeyExists: !!process.env.AWS_ACCESS_KEY_ID,
        databaseUrlExists: !!process.env.DATABASE_URL,
      },
    });
  }

  return new Promise((resolve) => {
    app(req as unknown as Request, res as unknown as Response, () =>
      resolve(undefined)
    );
  });
}
