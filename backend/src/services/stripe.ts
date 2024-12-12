import Stripe from "stripe";

// handle stripe initialization

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("stripe key not found");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-11-20.acacia",
});
