"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = exports.testAWSConnection = exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const sharp_1 = __importDefault(require("sharp"));
console.log("process.env.AWS_ACCESS_KEY_ID: ", process.env.AWS_ACCESS_KEY_ID);
// Initialize S3 client with AWS credentials from env vars
exports.s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
// Function to test AWS connection and find our bucket
const testAWSConnection = async () => {
    var _a;
    console.log({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    // Create command to list all buckets
    const command = new client_s3_1.ListBucketsCommand({});
    // Send command to AWS
    const response = await exports.s3Client.send(command);
    // Check if our bucket exists in the list
    const bucketExists = (_a = response.Buckets) === null || _a === void 0 ? void 0 : _a.some((bucket) => bucket.Name === process.env.AWS_BUCKET_NAME);
    return { bucketExists, bucketName: process.env.AWS_BUCKET_NAME };
};
exports.testAWSConnection = testAWSConnection;
const sanitizeFileName = (filename) => {
    return filename
        .replace(/[^a-zA-Z0-9-_.]/g, "-") // Replace any non-alphanumeric chars with dash
        .replace(/\s+/g, "-") // Replace spaces with dash
        .toLowerCase(); // Convert to lowercase
};
// Function to upload and process images
const uploadToS3 = async (file) => {
    // Process image: convert to WebP format with 90% quality
    const processedImage = await (0, sharp_1.default)(file.buffer) // 1 - start with raw bytes(buffer)
        // sharp is a library for image processing
        // sharp(file.buffer) -> takes the uploaded file's binary data
        // 2 - transforrm bytes itno webP format
        .webp({ quality: 90 }) // convert to webP format with 90% quality b/w size and quality
        // 3- get new webP bytes(buffer) to send to
        .toBuffer(); // converts the processed image back to a binary data that can be uploaded to S3
    // s3 needs binary data to upload -- cant directly upload sharp transformation object
    // Create unique filename with timestamp
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `images/${Date.now()}-${sanitizeFileName(file.originalname.split(".")[0])}.webp`,
        Body: processedImage,
        ContentType: "image/webp", // when files retrieved - this header tells browser how to treat image
        ServerSideEncryption: client_s3_1.ServerSideEncryption.AES256, // Use S3-managed keys instead of KMS
    };
    // Upload to S3 and return the file path
    await exports.s3Client.send(new client_s3_1.PutObjectCommand(uploadParams));
    return uploadParams.Key;
};
exports.uploadToS3 = uploadToS3;
