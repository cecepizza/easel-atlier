import { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Simple response to test if the function works
  return res.status(200).json({
    message: "API is working",
    query: req.query,
    method: req.method,
    path: req.url,
  });
}
