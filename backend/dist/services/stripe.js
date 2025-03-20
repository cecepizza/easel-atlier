"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripe = void 0;
const stripe_1 = __importDefault(require("stripe"));
// key validation and initialization
console.log("Initializing Stripe with key:", {
    keyExists: !!process.env.STRIPE_SECRET_KEY,
    keyFirstChars: (_a = process.env.STRIPE_SECRET_KEY) === null || _a === void 0 ? void 0 : _a.substring(0, 7),
});
// immediately throw an error if the key is not found
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY not found in environment variables");
}
if (!process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
    throw new Error("Invalid STRIPE_SECRET_KEY format - should start with 'sk_'");
}
// initialize stripe with the secret key
exports.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia",
});
