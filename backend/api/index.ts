import { VercelRequest, VercelResponse } from "@vercel/node";
import app from "../src/server";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // This is a serverless function that forwards requests to your Express app
  return app(req, res);
}
