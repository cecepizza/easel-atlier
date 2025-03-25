"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// main routes file
const express_1 = require("express");
const express_2 = require("@clerk/express");
const multer_1 = __importDefault(require("multer"));
const s3_1 = require("../services/s3");
const isAdmin_1 = require("../middleware/isAdmin");
const prisma_1 = require("../config/prisma");
const getImage_1 = __importDefault(require("./getImage"));
const getArtworksMetadata_1 = __importDefault(require("./getArtworksMetadata"));
const checkout_1 = __importDefault(require("./checkout"));
const router = (0, express_1.Router)();
// Configure multer for file uploads (5MB limit)
const upload = (0, multer_1.default)({ limits: { fileSize: 5 * 1024 * 1024 } });
// PROTECTED ROUTE: Get user details
router.get("/protected", (0, express_2.requireAuth)(), async (req, res) => {
    // Type assertion for auth object from Clerk
    const { auth } = req;
    // Get full user details from Clerk
    const user = await express_2.clerkClient.users.getUser(auth.userId);
    res.json({ user });
});
// TEST ROUTE: Verify auth is working
router.get("/test-auth", (0, express_2.requireAuth)(), (req, res) => {
    // log headers to see what we are getting
    console.log("Request Headers:", req.headers);
    const { auth } = req;
    res.json({
        message: "Auth is working!",
        userId: auth.userId,
    });
});
// TEST ROUTE: Verify AWS connection
router.get("/test-aws", async (req, res) => {
    try {
        // Test AWS connection and find our bucket
        const { bucketExists, bucketName } = await (0, s3_1.testAWSConnection)();
        res.json({
            success: true,
            message: "AWS creds working!",
            bucketFound: bucketExists,
            bucketName,
        });
    }
    catch (error) {
        console.error("❌ AWS credentials not working:", error);
        res.status(500).json({
            success: false,
            message: "AWS credentials not working",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
router.get("/test-db", async (req, res) => {
    try {
        // test prisma connection
        const count = await prisma_1.prisma.artwork.count();
        res.json({
            success: true,
            message: "DB connection successful",
            artworkCount: count,
        });
    }
    catch (error) {
        console.error("❌ DB connection failed:", error);
        res.status(500).json({
            success: false,
            message: "DB connection failed",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});
// UPLOAD ROUTE: Handle file uploads ADMIN ONLY!!!
router.post("/admin/upload", (0, express_2.requireAuth)(), // check if user is logged in
isAdmin_1.isAdmin, // check if user is admin
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
        const key = await (0, s3_1.uploadToS3)(req.file);
        console.log("🪣 S3 upload successful:", {
            key,
            bucket: process.env.AWS_BUCKET_NAME,
        });
        // Create DB record
        const artwork = await prisma_1.prisma.artwork.create({
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
    }
    catch (error) {
        console.error("❌ Upload error:", error);
        res.status(500).json({
            success: false,
            message: "Error uploading file",
            error: error instanceof Error ? error.message : String(error),
        });
    }
}));
// api endpoint that serves image data
router.use("/images", getImage_1.default); // .use() creates a route prefix - tells express where to look for handlers - creates API endpoint
router.use("/artworks", getArtworksMetadata_1.default);
// checkout routes for frontend
router.use("/checkout", checkout_1.default);
exports.default = router;
