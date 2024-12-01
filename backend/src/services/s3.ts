import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  ServerSideEncryption,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

// Initialize S3 client with AWS credentials from env vars
export const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Function to test AWS connection and find our bucket
export const testAWSConnection = async () => {
  // Create command to list all buckets
  const command = new ListBucketsCommand({});
  // Send command to AWS
  const response = await s3Client.send(command);
  // Check if our bucket exists in the list
  const bucketExists = response.Buckets?.some(
    (bucket) => bucket.Name === process.env.AWS_BUCKET_NAME
  );
  return { bucketExists, bucketName: process.env.AWS_BUCKET_NAME };
};

// Function to upload and process images
export const uploadToS3 = async (file: Express.Multer.File) => {
  // Process image: convert to WebP format with 90% quality
  const processedImage = await sharp(file.buffer) // 1 - start with raw bytes(buffer)
    // sharp is a library for image processing
    // sharp(file.buffer) -> takes the uploaded file's binary data

    // 2 - transforrm bytes itno webP format
    .webp({ quality: 90 }) // convert to webP format with 90% quality b/w size and quality

    // 3- get new webP bytes(buffer) to send to
    .toBuffer(); // converts the processed image back to a binary data that can be uploaded to S3

  // s3 needs binary data to upload -- cant directly upload sharp transformation object

  // Create unique filename with timestamp
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `images/${Date.now()}-${file.originalname.split(".")[0]}.webp`, // Create unique filename
    Body: processedImage,
    ContentType: "image/webp", // when files retrieved - this header tells browser how to treat image
    ServerSideEncryption: ServerSideEncryption.AES256, // Use S3-managed keys instead of KMS
  };

  // Upload to S3 and return the file path
  await s3Client.send(new PutObjectCommand(uploadParams));
  return uploadParams.Key;
};
