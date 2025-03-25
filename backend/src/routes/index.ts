// main routes file
import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import { requireAuth, clerkClient } from "@clerk/express";
import multer from "multer";
import { testAWSConnection, uploadToS3 } from "../services/s3";
import { isAdmin } from "../middleware/isAdmin";
import { prisma } from "../config/prisma";
import imageRoutes from "./getImage";
import artworkRoutes from "./getArtworksMetadata";
import checkoutRoutes from "./checkout";
import cors from "cors";

const router = Router();
// Configure multer for file uploads (5MB limit)
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

// PROTECTED ROUTE: Get user details
router.get("/protected", requireAuth(), async (req: Request, res: Response) => {
  // Type assertion for auth object from Clerk
  const { auth } = req as unknown as { auth: { userId: string } };
  // Get full user details from Clerk
  const user = await clerkClient.users.getUser(auth.userId);
  res.json({ user });
});

// TEST ROUTE: Verify auth is working
router.get("/test-auth", requireAuth(), (req: Request, res: Response) => {
  // log headers to see what we are getting
  console.log("Request Headers:", req.headers);
  const { auth } = req as unknown as { auth: { userId: string } };
  res.json({
    message: "Auth is working!",
    userId: auth.userId,
  });
});

// TEST ROUTE: Verify AWS connection
router.get("/test-aws", async (req: Request, res: Response) => {
  try {
    // Test AWS connection and find our bucket
    const { bucketExists, bucketName } = await testAWSConnection();
    res.json({
      success: true,
      message: "AWS creds working!",
      bucketFound: bucketExists,
      bucketName,
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

// UPLOAD ROUTE: Handle file uploads ADMIN ONLY!!!
router.post(
  "/admin/upload",
  requireAuth(), // check if user is logged in
  isAdmin as RequestHandler, // check if user is admin
  upload.single("image"), // multer processes the file upload
  (async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Log the incoming file details
      console.log("📦 Received file:", {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      });

      const { title, price, size, medium, style, pieceDate } = req.body;

      // Upload to S3
      const key = await uploadToS3(req.file);
      console.log("🪣 S3 upload successful:", {
        key,
        bucket: process.env.AWS_BUCKET_NAME,
      });

      // Create DB record
      const artwork = await prisma.artwork.create({
        data: {
          title,
          imageURL: key,
          pieceDate: new Date(pieceDate),
          size,
          style: [style],
          medium,
          price: parseFloat(price),
        },
      });
      console.log("💾 Database record created:", artwork);

      res.json({
        success: true,
        message: "db upload success",
        artwork, // Include the created artwork in response
        key,
      });
    } catch (error) {
      console.error("❌ Upload error:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading file",
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }) as RequestHandler
);

// api endpoint that serves image data
router.use("/images", imageRoutes); // .use() creates a route prefix - tells express where to look for handlers - creates API endpoint

router.use("/artworks", artworkRoutes);

// checkout routes for frontend
router.use("/checkout", checkoutRoutes);

export default router;
