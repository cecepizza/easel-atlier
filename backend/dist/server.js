"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const clerk_1 = require("./config/clerk");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables FIRST (must happen before any other code)
const app = (0, express_1.default)();
const port = 8000;
app.use(express_1.default.json()); // parse incoming JSON requests
// Add CORS middleware
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
}));
// Initialize Clerk middleware for auth
app.use((0, clerk_1.initClerk)());
// Add all routes from routes/index.ts
app.use(routes_1.default);
// API enpoint
// // Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
module.exports = app;
