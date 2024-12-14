import { describe, it, expect } from "vitest";
import { s3Client, uploadToS3 } from "../src/services/s3";
import { GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

describe("S3 Integration Tests", () => {
  it("should successfully upload, download and delete a test image", async () => {
    // Create a test image buffer using sharp
    const testImageBuffer = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    // Create mock file object similar to what multer provides
    const mockFile: Express.Multer.File = {
      buffer: testImageBuffer,
      originalname: "test-image.png",
      fieldname: "image",
      encoding: "7bit",
      mimetype: "image/png",
      size: testImageBuffer.length,
      stream: null as any,
      destination: "",
      filename: "",
      path: "",
    };

    // Upload the test image
    const key = await uploadToS3(mockFile);
    expect(key).toBeDefined();
    expect(key).toContain("images/");
    expect(key).toContain(".webp");

    // Download the uploaded image
    const getCommand = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    const downloadResponse = await s3Client.send(getCommand);
    expect(downloadResponse.ContentType).toBe("image/webp");

    // Verify we can read the image data
    if (!downloadResponse.Body) {
      throw new Error("No body in response");
    }
    const chunks: Uint8Array[] = [];
    // @ts-ignore: Body has transformToByteArray method
    const imageData = await downloadResponse.Body.transformToByteArray();
    expect(imageData.length).toBeGreaterThan(0);

    // Clean up - delete the test image
    const deleteCommand = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3Client.send(deleteCommand);

    // Verify deletion by attempting to get the deleted object
    try {
      await s3Client.send(getCommand);
      throw new Error("Image should have been deleted");
    } catch (error: any) {
      expect(error.name).toBe("NoSuchKey");
    }
  }, 10000); // Increase timeout to 10s since we're doing network calls
});
