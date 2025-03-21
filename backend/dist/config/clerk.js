"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initClerk = void 0;
const express_1 = require("@clerk/express");
const initClerk = () => {
    // Try to get publishable key from either NEXT_PUBLIC or regular env var
    const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
        process.env.CLERK_PUBLISHABLE_KEY;
    const secretKey = process.env.CLERK_SECRET_KEY;
    // Check if auth keys exist - exit if missing
    if (!publishableKey || !secretKey) {
        console.error("❌ Missing Clerk keys:", {
            hasPublishableKey: !!publishableKey,
            hasSecretKey: !!secretKey,
        });
        process.exit(1);
    }
    console.log("✅ Clerk keys loaded successfully");
    // Set the key and return middleware for Express to use
    process.env.CLERK_PUBLISHABLE_KEY = publishableKey;
    return (0, express_1.clerkMiddleware)();
};
exports.initClerk = initClerk;
