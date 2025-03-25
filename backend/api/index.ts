// api/db-test.ts
import { VercelRequest, VercelResponse } from "@vercel/node";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.time("db-connection");
  try {
    // Log the database URL (first few characters only for security)
    const dbUrlStart = process.env.DATABASE_URL?.substring(0, 20) + "...";
    console.log("Connecting to database:", dbUrlStart);

    // Initialize Prisma client
    if (!prisma) {
      console.log("Creating new Prisma client");
      prisma = new PrismaClient();
    } else {
      console.log("Using existing Prisma client");
    }

    // Simple query to test connection
    console.log("Executing count query...");
    const count = await prisma.artwork.count();
    console.timeEnd("db-connection");

    return res.status(200).json({
      success: true,
      message: "Database connection successful",
      artworkCount: count,
      connectionTime: "See function logs for timing",
    });
  } catch (error) {
    console.error("Database connection error:", error);
    console.timeEnd("db-connection");

    return res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
}
