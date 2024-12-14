import { Router, Request, Response } from "express";
import { GetObjectCommand } from "@aws-sdk/client-s3";
// getObjectCommand is an aws sdk command for retrieving objects from s3
import { s3Client } from "../services/s3";

// getImage.ts image request is to get image from s3 bucket and serve it to the client

const router = Router();

router.get("/:key", async (req: Request, res: Response) => {
  // router.get("/:key") is to get one artwork
  try {
    const { key } = req.params;
    console.log("key: ", key, process.env.AWS_BUCKET_NAME);

    // first we create a command to get bucket and key from s3
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });
    console.log("command: ", command);
    // then we send the command to s3 await aws to return the response
    const response = await s3Client.send(command); // response contains the file data and metadata (ContentType)

    console.log("response: ", response);

    // set appropriate headers for the response
    res.set("Content-Type", response.ContentType); // tells browser what type of file it is
    res.set("Cache-Control", "public, max-age=31536000"); // how long to cache - 1 year cache

    // Stream the response to client
    if (response.Body instanceof require("stream").Readable) {
      // response.Body is a ReadableStream of image data
      // @ts-ignore: Body has pipe method when it's a stream
      response.Body.pipe(res); // .pipe(res) efficiently streams the file data to the client
      // instead of loading the entire file into memory it streams in chunks
    } else {
      throw new Error("Invalid response body type");
    }
  } catch (error) {
    console.error("Error serving image:", error);
    res.status(500).json({
      success: false,
      message: "Error serving image",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
