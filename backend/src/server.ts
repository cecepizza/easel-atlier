import dotenv from "dotenv";
import express from "express";
import { initClerk } from "./config/clerk";
import routes from "./routes";
import cors from "cors";
import promptGeneration from "./routes/promptGeneration";
// Load environment variables FIRST (must happen before any other code)
dotenv.config();

const app = express();
const port = 8000;

app.use(express.json()); // parse incoming JSON requests

// Add CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);

// Initialize Clerk middleware for auth
app.use(initClerk());
// Add all routes from routes/index.ts
app.use(routes);

// API enpoint

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
