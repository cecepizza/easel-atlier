import Stripe from "stripe";

// Add more detailed logging
console.log("Environment variables:", {
  envKeys: Object.keys(process.env),
  stripeKeyExists: !!process.env.STRIPE_SECRET_KEY,
  stripeKeyLength: process.env.STRIPE_SECRET_KEY?.length,
});

// key validation and initialization
console.log("Initializing Stripe with key:", {
  keyExists: !!process.env.STRIPE_SECRET_KEY,
  keyFirstChars: process.env.STRIPE_SECRET_KEY?.substring(0, 7),
});

// immediately throw an error if the key is not found
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY not found in environment variables");
}

if (!process.env.STRIPE_SECRET_KEY.startsWith("sk_")) {
  throw new Error("Invalid STRIPE_SECRET_KEY format - should start with 'sk_'");
}
// initialize stripe with the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});
