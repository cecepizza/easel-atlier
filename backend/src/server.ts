import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { initClerk } from "./config/clerk";
import routes from "./routes";
import cors from "cors";
// Load environment variables FIRST (must happen before any other code)

const app = express();
const port = 8000;

app.use(express.json()); // parse incoming JSON requests

// Add CORS middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.FRONTEND_URL
        : process.env.LOCAL_FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Initialize Clerk middleware for auth
app.use(initClerk());
// Add all routes from routes/index.ts
app.use(routes);

// API enpoint

// // // Start server
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
// module.exports = app;

// Only start the server if we're not being imported by Vercel
// This check determines if this file is being run directly or imported
if (process.env.NODE_ENV !== "production" || require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
// export express app for vercel
export default app;
