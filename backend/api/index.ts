import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Simple response to test if basic functionality works
  return res.status(200).json({
    message: "API is working",
    query: req.query,
    method: req.method,
    path: req.url,
    env: {
      // Check if environment variables exist (don't show actual values)
      stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
      awsKeyExists: !!process.env.AWS_ACCESS_KEY_ID,
      databaseUrlExists: !!process.env.DATABASE_URL,
    },
  });
}
